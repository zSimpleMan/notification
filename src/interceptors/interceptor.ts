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

@Injectable()
export class Interceptor implements NestInterceptor {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelizeInstance
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const transaction: Transaction = await this.sequelizeInstance.transaction();

    req.transaction = transaction;
  
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (err) => {
        await transaction.rollback();

        const error: HttpException = new HttpException({
          type: err.response.error,
          message: err.message,
          details: err.response.message
        }, err.status || 500)

        return throwError(() => error)
      }),
    ).toPromise()
  }
}