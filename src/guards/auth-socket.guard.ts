import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import axios from 'axios'
@Injectable()
export class AuthSocketGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ) {
    console.log('active guard')
    const token = context.getArgs()[0].handshake.headers.authorization.split(' ')[1].trim()
    const req = context.switchToHttp().getRequest()

    if (!token || token === '') {
      throw new WsException('Missing token!')
    }

    let appContext = null

    try {
      appContext = await axios.get(`${process.env.AUTH_SERVICE}/api/auth`, {
        headers: { authorization: `Basic ${token}` }
      })
    } catch {
      throw new WsException('UNAUTHORIZED!')
    }

    if (!appContext) throw Error(`error when get app context`);

    const data = appContext.data

    const isSuperAdmin = data.user.isSuperAdmin;
    const isSwitchedAccount =
      data.account && data.originalAccount && data.account.id !== data.originalAccount.id;
    // let permissions = null;

    // if (isSwitchedAccount) {
    //   permissions = await this.accountTypeRepository.findPermissionsByAccountTypeId(
    //     Number(data.account.type)
    //   );
    // } else {
    //   permissions = await this.userRepository.getPermissions(
    //     Number(data.user.id),
    //     Number(data.account.id)
    //   );
    // }

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
}