import { Inject, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Transaction } from "sequelize";
import { ObjectHelper } from "src/helpers/object-helper";
export interface IRequestContext {
  params: any;
  body: any;
  query: any;
  method: string;
  headers: any;
  protocol: string;
  file?: any;
  files?: any;
}

export interface IAccountContext {
  id: number;
  name: string;
  type: number;
  permissions: string[];
  adminId: number;
  companyId: number;
  brandId: number;
}

@Injectable()
export class Context {
  public req: IRequestContext;
  public user;
  public transaction: Transaction;
  public timestamp: number;
  public events: Promise<any>[];
  public protocol: string;
  public originalUrl: string;

  constructor(
    req: any, transaction: any,
    ) {
    this.req = req;
    this.user = req.user;
    this.transaction = transaction;
    this.timestamp = Date.now();
    this.events = [];
    this.protocol = req.protocol;
    this.originalUrl = req.originalUrl;
  }

  // Get UI context component
  get uiComponent(): string {
    if (!this.req || !this.req.headers || !this.req.headers['x-advalue-component']) return null;

    return this.req.headers['x-advalue-component'];
  }

  get isSuperAdmin(): boolean {
    if (!this.user || !this.user.isSuperAdmin) return false;

    return this.user.isSuperAdmin;
  }

  get isAdminAccount(): boolean {
    if (!this.user || !this.user.account || !this.user.account.type) return false;

    return this.user.account.type === 1;
  }

  get isCompanyAccount(): boolean {
    if (!this.user || !this.user.account || !this.user.account.type) return false;

    return this.user.account.type === 2;
  }

  get   isBrandAccount(): boolean {
    if (!this.user || !this.user.account || !this.user.account.type) return false;

    return this.user.account.type === 3;
  }

  get isNotAnAdmin(): boolean {
    return (
      !(this.isSuperAdmin || this.isAdminAccount) ||
      this.isSwitchedAccount /* switched account is not admin, case super admin switch to admin is not support now */
    );
  }

  get isSwitchedAccount(): boolean {
    if (!this.user || !this.user.isSwitchedAccount) return false;

    return this.user.isSwitchedAccount;
  }

  get userId(): number {
    if (!this.user || !this.user.id) return null;

    return this.user.id;
  }

  get accountTypeId(): number {
    if (!this.user || !this.user.account || !this.user.account.type) return null;

    return this.user.account.type;
  }

  get accountId(): number {
    if (!this.user || !this.user.account || !this.user.account.id) return null;

    return this.user.account.id;
  }

  get companyId(): number {
    if (!this.user || !this.user.account || !this.user.account.companyId) return null;

    return this.user.account.companyId;
  }

  get brandId(): number {
    if (!this.user || !this.user.account || !this.user.account.brandId) return null;

    return this.user.account.brandId;
  }

  get hasOriginalContext() {
    return this.user && this.user.originalAccount;
  }

  get campaignId() {
    return this.req.query.campaignId;
  }

  getOriginalContext() {
    // Use case roll back to original account
    if (!this.hasOriginalContext) throw Error('This user does not has original context');

    const originalContext =  ObjectHelper.cloneDeep(this);

    originalContext.user.account = this.user.originalAccount;

    return originalContext;
  }

  hasPermission(permissionId: number): boolean {
    if (!this.user) return false;

    return this.user.permissions.find(permission => permission.id === permissionId) !== undefined;
  }
}
