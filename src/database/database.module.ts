import { Module } from '@nestjs/common';
import { writeDatabaseProviders } from './write-database.providers';
import { readDatabaseProviders } from './read-database.providers';

@Module({
  providers: [
    ...writeDatabaseProviders,
    ...readDatabaseProviders,
  ],
  exports: [
    ...writeDatabaseProviders,
    ...readDatabaseProviders,
  ],
})
export class DatabaseModule {}