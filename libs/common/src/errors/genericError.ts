import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export interface GenericErrorResponse {
  code: HttpStatus;
  message: string;
}

export class GenericError extends RpcException {
  constructor(
    message: string,
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({
      code,
      message,
    });
  }
}
