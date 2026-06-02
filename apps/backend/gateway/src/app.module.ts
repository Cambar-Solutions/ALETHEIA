import { JwtAuthGuard, JwtStrategy, PrivilegeGuard } from '@aletheia/backend-commons';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PassportModule, AuthModule, ReportsModule],
  providers: [
    JwtStrategy,
    // Protección global: JWT primero, luego privilegios. @Public() exenta rutas.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PrivilegeGuard },
  ],
})
export class AppModule {}
