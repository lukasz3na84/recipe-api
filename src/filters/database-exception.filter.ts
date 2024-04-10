import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PostgresError } from 'pg-error-enum';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Database error';

    if (exception instanceof QueryFailedError) {
      if (exception.driverError?.code === PostgresError.UNIQUE_VIOLATION) {
        message = 'Duplicate entry';
        statusCode = HttpStatus.CONFLICT;
      }
    }

    //rozszerzenie komunikatu błędów dla środowiska 'development', dodano construktor i dodano wpis w main.ts
    if (this.configService.get('NODE_ENV') === 'development') {
      return response.status(statusCode).json({
        statusCode,
        stack: exception.stack,
        message: exception.message,
      });
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
