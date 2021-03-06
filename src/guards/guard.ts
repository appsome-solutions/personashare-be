import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnknownElementException } from '@nestjs/core/errors/exceptions/unknown-element.exception';

export type GuardType = 'GQL' | 'REST';

export class Guard {
  constructor(private readonly type: GuardType) {}

  getRequest(context: ExecutionContext): Request {
    switch (this.type) {
      case 'GQL':
        return GqlExecutionContext.create(context).getContext().req;
      case 'REST':
        return context.switchToHttp().getRequest();
      default:
        throw new UnknownElementException(`${this.type} guard`);
    }
  }

  getResponse(context: ExecutionContext): Response {
    switch (this.type) {
      case 'GQL':
        return GqlExecutionContext.create(context).getContext().res;
      case 'REST':
        return context.switchToHttp().getResponse();
      default:
        throw new UnknownElementException(`${this.type} guard`);
    }
  }
}
