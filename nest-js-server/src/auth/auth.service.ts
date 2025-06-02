import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { User } from 'generated/prisma';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.prismaService.user.findUnique({
      where: { login: dto.login },
    });

    if (isExists)
      throw new ConflictException(
        'Пользователь с таким логином уже существует',
      );

    const newUser = await this.prismaService.user.create({
      data: {
        login: dto.login,
        password: await hash(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      },
      include: { object: true },
    });

    return this.saveSession(req, newUser);
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) throw new NotFoundException('Неверный логин или пароль');

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword)
      throw new UnauthorizedException('Неверный логин или пароль');

    return this.saveSession(req, user);
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
