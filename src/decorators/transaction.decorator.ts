import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transaction } from 'sequelize'

export const TransactionParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const transaction: Transaction = req.transaction

    return transaction;
  },
);