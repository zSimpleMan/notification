import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'src/entities/context.entity';

export const ContextParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const context: Context = req.ctx

    return context;
  },
);