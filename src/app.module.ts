import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { QueryModule } from './query/query.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NotificationModule,
    DatabaseModule,
    UserModule,
    QueryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
