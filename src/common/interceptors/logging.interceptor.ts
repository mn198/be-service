import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    request.startTime = now;

    const url = request.originalUrl;
    const method = request.method;
    const paramsReq = JSON.stringify(request.params);
    const queryReq = JSON.stringify(request.query);
    const bodyReq = JSON.stringify(request.body);
    const userAgent = request.get('user-agent') || '';
    return next.handle().pipe(
      tap((data) => {
        const timeExecuted = Date.now() - now;
        const clientIp = request.clientIp;
        const contentLength = response.get('content-length');
        this.logger.log(
          {
            fields: {
              info: `${method}: ${url} - ${response.statusCode} - ${timeExecuted}ms`,
              method,
              userAgent,
              clientIp,
              contentLength,
              url,
              bodyReq,
              queryReq,
              paramsReq,
              status: response.statusCode,
              timeExecuted,
              unitTime: 'ms',
              dataRes: JSON.stringify(data),
            },
          },
          context.getClass().name,
          false,
        );
      }),
    );
  }
}
