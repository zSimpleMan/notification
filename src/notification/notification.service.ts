import { Inject, Injectable } from '@nestjs/common';
import BaseService from 'src/share/service.base';
import { CreateNotificationDto } from './dto/create.dto';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @Inject('NOTIFICATIONS_REPOSITORY')
    private notificationRepository: typeof Notification
  ) {
    super(notificationRepository);
  }

  // async create (notification: CreateNotificationDto) {
  //   const data = await this.notificationRepository.create<Notification>({
  //     ...notification
  //   })

  //   return data
  // }

  // async findAll(): Promise<Notification[]> {
  //   const data = super.
  // }
}
