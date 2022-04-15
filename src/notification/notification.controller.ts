import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/decorators/transaction.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Interceptor } from 'src/middlewares/interceptor';
import { ICriteria } from 'src/interfaces/interfaces';
import { CreateNotificationDto } from './dto/create.dto';
import { Notification } from './notification.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { Not } from 'sequelize-typescript';

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor (
    private readonly notificationService: NotificationService,
    private readonly notificationGateWay: NotificationGateway,
  ) {}

  @Post()
  @UseInterceptors(Interceptor)
  async create(@Body() dto: CreateNotificationDto, @TransactionParam() transaction: Transaction): Promise<Notification> {

    let room = ''

    if (dto.type === 'NOTI_USER' && dto.userId) {
      room = `room-user-${dto.userId}`
    }
    else if (dto.type === 'NOTI_BRAND' && dto.brandId) {
      room = `room-brand-${dto.brandId}`
    }
    else if (dto.type === 'NOTI_COMPANY' && dto.companyId) {
      room = `room-company-${dto.companyId}`
    }
    else {
      throw new BadRequestException('type invalid!')
    }

    const data = await this.notificationService.create(dto, transaction)

    await this.notificationGateWay.sendNoti({
      room,
      message: data
    })

    return data
  }

  @Get()
  @UseInterceptors(Interceptor)
  async find(@Query() criteria: ICriteria, @TransactionParam() transaction: Transaction) {
    // console.log(Notification.getTableName())
    return await this.notificationService.findAll(criteria, transaction)
  }
}
