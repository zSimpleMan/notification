import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus
  
    if (!exception.status) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
      exception.message = `The server failed to handle this request`
      exception.name = 'InternalServerError'
    } else {
      httpStatus = exception.getStatus();
    }

    const responseBody = {
      type: exception.name,
      error: exception.message,
      details: exception.response ? exception.response.message : undefined
    };

    console.log(exception)

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
