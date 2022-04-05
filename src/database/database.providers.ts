import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Notification } from '../notification/notification.entity'

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
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
  Notification,
  User
]