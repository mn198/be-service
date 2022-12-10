export class ErrorCode {
  private static createErrorMap(): Map<string, string> {
    const errorCode = new Map();
    errorCode.set('ERR:00000', 'Something went wrong');
    errorCode.set('ERR:00204', 'No content');
    errorCode.set('ERR:00400', 'Bad request');
    errorCode.set('ERR:00400', 'Not found');
    errorCode.set('ERR:00403', 'Forbidden');
    errorCode.set('ERR:00500', 'Internal server error');
    return errorCode;
  }

  private static errorMap = ErrorCode.createErrorMap();

  static getError(code): string {
    if (this.errorMap.has(code)) {
      return this.errorMap.get(code);
    }
    return 'Error code has not been defined';
  }

  static defaultErrorCode() {
    return 'ERR:00000';
  }
}
