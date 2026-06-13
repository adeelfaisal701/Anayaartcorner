import { Module } from '@nestjs/common';
import { ArtworksModule } from './artworks/artworks.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { HealthController } from './health/health.controller';
import { PortraitsModule } from './portraits/portraits.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ArtworksModule,
    PortraitsModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
