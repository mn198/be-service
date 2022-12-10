import { defer, iif, Observable, throwError, timer } from 'rxjs';
import { concatMap, retryWhen, tap } from 'rxjs/operators';

export const retryWithBackoffDelay = (config: {
  initialInterval: number;
  maxRetries: number;
  maxInterval: number;
  resetOnSuccess?: boolean;
  shouldRetry?: (error: any) => boolean;
}): (<T>(source: Observable<T>) => Observable<T>) => {
  const {
    initialInterval,
    maxRetries = Infinity,
    maxInterval = Infinity,
    shouldRetry = () => true,
    resetOnSuccess = false,
  } = config;
  return <T>(source: Observable<T>) => {
    return defer(() => {
      let index = 0;
      return source.pipe(
        retryWhen<T>((errors) =>
          errors.pipe(
            concatMap((error) => {
              const attempt = index++;
              return iif(
                () => attempt < maxRetries && shouldRetry(error),
                timer(
                  Math.min(Math.pow(2, attempt) * initialInterval, maxInterval),
                ),
                throwError(() => error),
              );
            }),
          ),
        ),
        tap(() => {
          if (resetOnSuccess) {
            index = 0;
          }
        }),
      );
    });
  };
};
