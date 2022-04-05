import { Sequelize } from "sequelize";
import { Notification } from "./notification.entity";

export const NotificationsProviders = [
  {
    provide: 'NOTIFICATIONS_REPOSITORY',
    useValue: Notification,
  },
  // {
  //   provide: 'SEQUELIZE',
  //   useExist
  // },
];