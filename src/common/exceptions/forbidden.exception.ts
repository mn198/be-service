import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../errors/error-code';

export class ForbiddenException extends HttpException {
  constructor({ code, message }: { code?: string; message?: string }) {
    super(
      HttpException.createBody({
        code: code || '403',
        errorCode: 'ERR:00403',
        message: message || ErrorCode.getError('ERR:00403'),
      }),
      HttpStatus.FORBIDDEN,
    );
  }
}
