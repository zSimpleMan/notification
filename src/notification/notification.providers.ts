import { NotificationRead } from "./notification-read.entity";
import { NotificationWrite } from "./notification-write.entity";

export const NotificationsProviders = [
  {
    provide: 'NOTIFICATIONS_READ_REPOSITORY',
    useValue: NotificationRead,
  },
  {
    provide: 'NOTIFICATIONS_WRITE_REPOSITORY',
    useValue: NotificationWrite,
  },
  // {
  //   provide: 'SEQUELIZE',
  //   useExist
  // },
];