import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
// import axios from 'axios'
import { HttpClient } from 'src/helpers/http-client';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest()

    const token = this.getToken(req)

    if (!token || token === '') {
      throw new HttpException('Missing Token', HttpStatus.UNAUTHORIZED)
    }

    const httpClient = new HttpClient(
      process.env.AUTH_SERVICE
    )

    let data = null

    try {
      data = await httpClient.get('/api/auth', { authorization: `Basic ${token}` })

      if (!data) throw Error(`error when get app context`);

    } catch {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)
    }

    const isSuperAdmin = data.user.isSuperAdmin;
    const isSwitchedAccount =
      data.account && data.originalAccount && data.account.id !== data.originalAccount.id;

    req.user = {
      ...data.user,
      ...{
        token,
        isSuperAdmin,
        isSwitchedAccount,
        account: data.account,
        originalAccount: data.originalAccount,
        // permissions
      }
    };

    return true
  }

  private getToken(req): string {
    const token = null;
    if (req.query.token) return req.query.token as string;
    if (req.headers.authorization) return req.headers.authorization.split(' ')[1];

    return token;
  }
}