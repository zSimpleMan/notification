import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Context } from 'src/entities/context.entity';

@Injectable()
export class Interceptor implements NestInterceptor {
  constructor(
    @Inject('SEQUELIZE_READ_INSTANCE')
    private readonly sequelizeInstance
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const transaction: Transaction = await this.sequelizeInstance.transaction();

    const ctx = new Context(req, transaction)
    req.transaction = transaction;
    req.ctx = ctx
    console.log(1)
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (err) => {
        await transaction.rollback();

        return throwError(() => err)
      }),
    ).toPromise()
  }
}