import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { NotificationRead } from 'src/notification/notification-read.entity';

export const readDatabaseProviders = [
  {
    provide: 'SEQUELIZE_READ_INSTANCE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'nhathan',
        password: 'postgres',
        database: 'dmp',
      });
      sequelize.addModels(models);
      // await sequelize.sync();
      return sequelize;
    },
  },
];

const models = [
  NotificationRead,
  User
]