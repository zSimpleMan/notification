import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/decorators/transaction.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Interceptor } from 'src/interceptors/interceptor';
import { ICriteria } from 'src/interfaces/interfaces';
import { CreateNotificationDto } from './dto/create.dto';
import { Notification } from './notification.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor (
    private readonly notificationService: NotificationService,
    private readonly notificationGateWay: NotificationGateway,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(Interceptor)
  async create(@Body() dto: CreateNotificationDto, @TransactionParam() transaction: Transaction): Promise<Notification> {
    // const dto: CreateNotificationDto = req.body
    let room = ''

    if (dto.type === 'NOTI_USER') {
      room = `room-user-${dto.userId}`
    }
    else if (dto.type === 'NOTI_BRAND') {
      room = `room-brand-${dto.brandId}`
    }
    else if (dto.type === 'NOTI_COMPANY') {
      room = `room-company-${dto.companyId}`
    }
    else {
      throw new HttpException('type invalid', HttpStatus.BAD_REQUEST)
    }

    const data = await this.notificationService.create(dto, transaction)

    await this.notificationGateWay.sendNoti({
      room,
      message: data.message
    })

    return data
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(Interceptor)
  async find(@Query() criteria: ICriteria, @TransactionParam() transaction: Transaction) {
    return await this.notificationService.findAll(criteria, transaction)
  }
}
