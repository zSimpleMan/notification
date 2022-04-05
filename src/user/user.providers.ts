import { User } from "./user.entity";

export const UsersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
];