import { Inject, Injectable, Req, Scope } from '@nestjs/common';
import { FindOptions, IncludeOptions, WhereOptions } from 'sequelize'
import { isArray } from 'lodash'
import { Sequelize } from 'sequelize-typescript'
import { ACCOUNT_TYPES, EntityStatus, ICriteria, IFilter, IInclude, ISort } from '../interfaces/interfaces';
import { ObjectHelper } from '../helpers/object-helper'
import { SequelizeOptionsParser } from '../helpers/query-parser'
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ContextParam } from 'src/decorators/ctx.decorator';
import { Context } from 'src/entities/context.entity';

@Injectable({ scope: Scope.REQUEST })
export class QueryService {
  private sequelizeOptionsParser: SequelizeOptionsParser

  constructor (
    @Inject(REQUEST) private req
  ) {
    this.sequelizeOptionsParser = SequelizeOptionsParser.getInstance()
  }

  parse(rawCriteria: ICriteria): FindOptions {
    let finalResult: FindOptions = {};

    if (!rawCriteria) {
      return finalResult;
    }

    const { select, filters, limit, page, includes, sort, search, groupBy, offset, ...otherCriterias } = rawCriteria;

    if (select && select.length) {
      finalResult.attributes = this.sequelizeOptionsParser._parseSelect(select);
    }

    if (groupBy && groupBy.length) {
      finalResult.group = this.sequelizeOptionsParser._parseGroupBy(groupBy);
    }

    if (filters && filters.length) {
      finalResult.where = this.sequelizeOptionsParser._parseFilters(filters);
    }

    if (limit && (page || offset !== undefined)) {
      finalResult.limit = limit;
      finalResult.offset = page ? (page - 1) * limit : offset;
    }

    const parsedInclude: IInclude[] = JSON.parse(includes.toString())
    if (parsedInclude && parsedInclude.length) {
      finalResult.include = this.sequelizeOptionsParser._parseIncludes(parsedInclude);
    }

    if (sort) {
      finalResult.order = this.sequelizeOptionsParser._parseSort(sort);
    }

    if (search) {
      finalResult.where = finalResult.where
        && Object.assign(finalResult.where, this.sequelizeOptionsParser._parseSearch(search))
        || this.sequelizeOptionsParser._parseSearch(search);
    }

    finalResult = {
      ...finalResult,
      ...otherCriterias,
    };
    
    return finalResult;
  }

  public ownerFilter (respository: any, whereOptions: WhereOptions) {

    switch (respository.getTableName()) {
      case 'pl_notifications':
        const newWhereOptions = this.addFilterForNonAdmin(whereOptions, this.req.ctx)
        return newWhereOptions
    }
    console.log('x')
  }

  private filterSoftDeletedIdsByColumn(whereOptions: WhereOptions): WhereOptions {
    return this.sequelizeOptionsParser._appendAnd(whereOptions, 'isDeleted', {
      isDeleted: { $not: true }
    });
  }
  
  private filterSoftDeletedIdsByStatus(whereOptions: WhereOptions): WhereOptions {
    return this.sequelizeOptionsParser._appendAnd(whereOptions, 'status', {
      status: { $not: EntityStatus.Deleted }
    });
  }
  
  private selectOnlyAccountTypeId(whereOptions: WhereOptions, accountTypeId: number): WhereOptions {
    return this.sequelizeOptionsParser._appendAnd(whereOptions, 'accountTypeId', {
      accountTypeId
    });
  }
  
  private addFilterForNonAdmin(whereOptions: WhereOptions, ctx: Context) {
    if (ctx.accountTypeId !== ACCOUNT_TYPES.Admin) {
      if (ctx.isBrandAccount) {
        return this.sequelizeOptionsParser._appendAnd(whereOptions, 'brandId', { brandId: ctx.brandId || 0 });
      } else {
        return this.sequelizeOptionsParser._appendAnd(whereOptions, 'companyId', { companyId: ctx.companyId || 0 });
      }
    }
  }
}
