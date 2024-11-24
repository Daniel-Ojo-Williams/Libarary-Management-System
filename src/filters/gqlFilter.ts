import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    return new GraphQLError(exception.message, {
      extensions: {
        code: exception.getStatus(),
        http: {
          status: exception.getStatus(),
        },
      },
    });
  }
}
