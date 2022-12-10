import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IErrorResponse } from '../interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status: HttpStatus = exception.getStatus();
    const errorCode: string = (exception as any).errorCode;
    const errorMessage: string = exception.message;
    const { code, message } = exception.getResponse() as any;
    const httpErrorResponse: IErrorResponse = {
      status: status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage || 'Internal Server Error',
      errorCode,
      errors: [{ code, message }],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };
    const timeExecuted = Date.now() - (request as any).startTime || '';
    // elk logging errors
    this.logger.error({
      fields: {
        info: `${request.method}: ${request.originalUrl} - ${response.statusCode} - ${timeExecuted}ms`,
        method: request.method,
        url: request.originalUrl,
        bodyReq: JSON.stringify(request.body),
        queryReq: JSON.stringify(request.query),
        paramsReq: JSON.stringify(request.params),
        errors: exception.getResponse(),
        status: httpErrorResponse.status,
        timeExecuted,
        unitTime: 'ms',
        dataRes: httpErrorResponse,
      },
    });

    response.status(httpErrorResponse.status).json(httpErrorResponse);
  }
}
