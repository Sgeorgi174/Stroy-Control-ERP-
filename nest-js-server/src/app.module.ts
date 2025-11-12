import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ObjectModule } from './object/object.module';
import { ToolModule } from './tool/tool.module';
import { ClothesModule } from './clothes/clothes.module';
import { EmployeeModule } from './employee/employee.module';
import { ToolHistoryModule } from './tool-history/tool-history.module';
import { ClothesHistoryModule } from './clothes-history/clothes-history.module';
import { EmployeeClothingModule } from './employee-clothing/employee-clothing.module';
import { DeviceModule } from './device/device.module';
import { DeviceHistoryModule } from './device-history/device-history.module';
import { TabletModule } from './tablet/tablet.module';
import { TabletHistoryModule } from './tablet-history/tablet-history.module';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { SkillModule } from './skill/skill.module';
import { ShiftModule } from './shift/shift.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
      }),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ObjectModule,
    ToolModule,
    ClothesModule,
    EmployeeModule,
    ToolHistoryModule,
    ClothesHistoryModule,
    EmployeeClothingModule,
    DeviceModule,
    DeviceHistoryModule,
    TabletModule,
    TabletHistoryModule,
    TelegramBotModule,
    SkillModule,
    ShiftModule,
  ],
})
export class AppModule {}
