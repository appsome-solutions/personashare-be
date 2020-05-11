import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';
import { Guard } from './guard';
import { Request } from 'express';

@Injectable()
export class GqlUserGuard extends Guard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {
    super('GQL');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);

    return this.validateUser(request);
  }

  async validateUser(request: Request): Promise<boolean> {
    const authHeader = request.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';

    if (!token) {
      return false;
    }

    try {
      const user = await this.firebaseService.getDecodedClaim(token);

      return !!(user && user.uid);
    } catch (e) {
      return false;
    }
  }
}
