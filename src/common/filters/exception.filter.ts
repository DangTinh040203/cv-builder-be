import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const resBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let message: string | string[] | object = 'Unexpected error';
    if (typeof resBody === 'string') {
      message = resBody;
    } else if (typeof resBody === 'object' && resBody !== null) {
      if ('message' in resBody) {
        message = (resBody as { message: string | string[] }).message;
      } else {
        message = resBody;
      }
    }

    const errorResponse = {
      statusCode: status,
      error:
        exception instanceof HttpException
          ? exception.constructor.name
          : 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
