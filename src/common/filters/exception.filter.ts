import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '@/common/types/response';

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

    const message = this.extractMessage(resBody);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      error:
        exception instanceof HttpException
          ? exception.constructor.name
          : 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.log('🚀 ~ HttpExceptionFilter:', errorResponse);
    response.status(status).json(errorResponse);
  }

  private extractMessage(resBody: unknown): string | string[] | object {
    if (typeof resBody === 'string') return resBody;

    if (typeof resBody === 'object' && resBody !== null) {
      const body = resBody as Record<string, any>;
      return body.message ?? body;
    }

    return 'Unexpected error';
  }
}
