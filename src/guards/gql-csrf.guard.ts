import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Guard } from './guard';
import { CSRF_TOKEN_NAME } from '../auth';

@Injectable()
export class GqlCSRFGuard extends Guard implements CanActivate {
  constructor() {
    super('GQL');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);
    const inputArgument = context.getArgByIndex(1);

    if (inputArgument && inputArgument.user) {
      const { csrfToken } = inputArgument.user;
      const csrfCookie = request.cookies[CSRF_TOKEN_NAME];
      return csrfToken === csrfCookie;
    } else {
      throw new ForbiddenException();
    }
  }
}
