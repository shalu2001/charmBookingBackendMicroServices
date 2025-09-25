import { GenericErrorResponse } from '@charmbooking/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: GenericErrorResponse) => {
        if (
          typeof error === 'object' &&
          'code' in error &&
          'message' in error
        ) {
          return throwError(() => new RpcException(error));
        }
        return throwError(() => error);
      }),
    );
  }
}
