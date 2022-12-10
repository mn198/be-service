import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../errors/error-code';

export class BadRequestException extends HttpException {
  constructor({ code, message }: { code?: string; message?: string }) {
    super(
      HttpException.createBody({
        code: code || '400',
        errorCode: 'ERR:00400',
        message: message || ErrorCode.getError('ERR:00400'),
      }),
      HttpStatus.BAD_REQUEST,
    );
  }
}
