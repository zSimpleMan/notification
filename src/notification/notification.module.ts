import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway'
import { NotificationsProviders } from './notification.providers';
import { APP_INTERCEPTOR } from '@nestjs/core'
import { Interceptor } from 'src/interceptors/interceptor';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    ...NotificationsProviders,
  ]

})
export class NotificationModule {}
