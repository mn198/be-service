import { HttpStatus } from '@nestjs/common';

export interface IErrorResponse {
  status: HttpStatus;
  message?: string;
  errorCode: string;
  errors: any;
  data?: Record<string, unknown>;
  timestamp: string;
  path: string;
  method: string;
}
