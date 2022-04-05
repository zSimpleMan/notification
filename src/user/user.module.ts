import { Module } from '@nestjs/common';
import { UsersProviders } from './user.providers';

@Module({
  providers: [
    ...UsersProviders
  ]
})
export class UserModule {}
