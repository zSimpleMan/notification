import { Inject, Injectable, Req } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import axios from 'axios';
import { HttpClient } from 'src/helpers/http-client';
import { QueryService } from 'src/query/query.service';
import BaseService from 'src/share/service.base';
import { CreateNotificationDto } from './dto/create.dto';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @Inject('NOTIFICATIONS_READ_REPOSITORY')
    private notificationReadRepository: typeof Notification,
    @Inject('NOTIFICATIONS_WRITE_REPOSITORY')
    private notificationWriteRepository: typeof Notification,
    public queryService: QueryService,
  ) {
    super(notificationReadRepository, notificationWriteRepository, queryService);
  }

  async verify(token: string): Promise<any> {

    const httpClient = new HttpClient(
      process.env.AUTH_SERVICE
    )

    let data = null

    try {
      data = await httpClient.get('/api/auth', { authorization: `Basic ${token}` })

      if (!data) throw Error(`error when get app context`);

    } catch {
      throw new WsException('unauthorize')
    }

    const isSuperAdmin = data.user.isSuperAdmin;
    const isSwitchedAccount =
      data.account && data.originalAccount && data.account.id !== data.originalAccount.id;

    const user = {
      ...data.user,
      ...{
        token,
        isSuperAdmin,
        isSwitchedAccount,
        account: data.account,
        originalAccount: data.originalAccount,
        // permissions
      }
    };

    return user
  }

  // private getToken(req): string {
  //   const token = null;
  //   if (req.query.token) return req.query.token as string;
  //   if (req.headers.authorization) return req.headers.authorization.split(' ')[1];

  //   return token;
  // }
}
