import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        const message = 
          (exception.meta?.cause as string) || 
          'The resource you requested could not be found.';

        response.status(status).json({
          statusCode: status,
          error: 'Not Found',
          message: message,
        });
        break;
      }
      default:
        // NestJS default handling
        super.catch(exception, host);
        break;
    }
  }
}