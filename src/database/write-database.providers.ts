import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { NotificationWrite } from '../notification/notification-write.entity'
export const writeDatabaseProviders = [
  {
    provide: 'SEQUELIZE_WRITE_INSTANCE',
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
  NotificationWrite,
  User
]