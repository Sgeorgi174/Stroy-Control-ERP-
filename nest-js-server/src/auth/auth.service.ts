import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.prismaService.user.findUnique({
      where: { phone: dto.phone },
    });

    if (isExists) {
      throw new ConflictException(
        'Пользователь с таким номером телефона уже существует',
      );
    }

    // Если указан объект — проверить, не занят ли он
    if (dto.objectId) {
      const object = await this.prismaService.object.findUnique({
        where: { id: dto.objectId },
      });

      if (!object) {
        throw new NotFoundException('Объект с указанным ID не найден');
      }

      if (object.userId !== null) {
        throw new ConflictException(
          'Указанный объект уже закреплён за другим пользователем. Освободите его перед назначением.',
        );
      }
    }

    const newUser = await this.prismaService.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      },
      include: { object: true },
    });

    // Если передан объект — привязать его к новому пользователю
    if (dto.objectId) {
      await this.prismaService.object.update({
        where: { id: dto.objectId },
        data: { userId: newUser.id },
      });
    }

    return this.saveSession(req, newUser);
  }

  public async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user)
      throw new NotFoundException(
        'Пользователь с таким номером не зарегистрирован. Пожалуйста, обратитесь к администратору ',
      );

    await this.telegramBotService.sendOtp({
      phone: user.phone,
      userId: user.id,
    });

    return { success: true };
  }

  public async verifyOtp(req: Request, dto: VerifyOtpDto) {
    const user = await this.prismaService.user.findUnique({
      where: { phone: dto.phone },
      include: { verificationCode: true },
    });

    if (!user || !user.verificationCode) {
      throw new NotFoundException('OTP не найден');
    }

    const now = new Date();

    if (now > user.verificationCode.codeExp) {
      throw new BadRequestException('OTP истёк');
    }

    if (user.verificationCode.code !== dto.otp) {
      throw new UnauthorizedException('Неверный OTP');
    }

    // Очистим OTP после успешной проверки
    await this.prismaService.verifacationCode.delete({
      where: { userId: user.id },
    });

    return this.saveSession(req, user);
  }

  public async getMe(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        object: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  public async logout(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Не удалось завершить сессию'),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

        resolve('Сессия удалена');
      });
    });
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err)
          return reject(
            new InternalServerErrorException('Не удалось сохранить сессию'),
          );

        resolve({ user });
      });
    });
  }
}
