import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
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
  ],
})
export class AppModule {}
