import {
  ExceptionFilter,
  Catch,
  BadRequestException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const res: any = exception.getResponse();

    const messages = Array.isArray(res.message)
      ? res.message
      : [res.message];

    response.status(400).json({
      statusCode: 400,
      message: messages.join(', '),
      errors: messages,
      success: false
    });
  }
}