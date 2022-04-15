import { IncludeOptions, WhereOptions } from 'sequelize'
import { isArray } from 'lodash'
import { Sequelize } from 'sequelize-typescript'
import { IFilter, IInclude, ISort } from '../interfaces/interfaces';
import { ObjectHelper } from './object-helper';

export class SequelizeOptionsParser {

  private static instance: SequelizeOptionsParser

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance () {
    if (!this.instance) {
      this.instance = new SequelizeOptionsParser()
    }
    return this.instance
  }

  _parseGroupBy(rawGroupBy: any): any[] {
    if (typeof rawGroupBy === 'string') {
      rawGroupBy = rawGroupBy.split(',').map(i => i.trim());
    }

    const findAttributes = rawGroupBy.map(column => {
      const isAggregationColumn = column.includes(':');
      if (isAggregationColumn) {
        return this._parseAggregationColumnForGroupBy(column);
      }

      return column;
    });

    return findAttributes;
  }

  _parseSelect(rawSelect: any): any[] {
    if (isArray(rawSelect)) {
      const findAttributes = rawSelect.map(column => {
        const isAggregationColumn = column.includes(':');
        if (isAggregationColumn) {
          return this._parseAggregationColumn(column);
        }

        return column;
      });

      return findAttributes;
    } else if (typeof rawSelect === 'string') {
      const selectColumns = rawSelect.split(',').map(i => i.trim());
      
      const findAttributes = selectColumns.map(column => {
        const isAggregationColumn = column.includes(':');
        if (isAggregationColumn) {
          return this._parseAggregationColumn(column);
        }

        return column;
      });

      return findAttributes;
    }

    throw new Error('Select must be a string or an array');
  }

  _parseAggregationColumn(aggretionColumn: string): any[] {
    const [aggregationFunction, aggregationColumn, aliasColumn] = aggretionColumn.split(':').map(i => i.trim());

    const isRawQuery: boolean = aggregationFunction.startsWith('raw');
    if (isRawQuery) {
      return [
        Sequelize.literal(`${aggregationColumn}`),
        aliasColumn,
      ];
    }

    const isLiteral = aggregationFunction.includes('+literal');
    if (isLiteral) {
      const [fn] = aggregationFunction.split('+');

      return [
        Sequelize.literal(`${fn.toUpperCase()}(${aggregationColumn})`),
        aliasColumn || aggregationColumn
      ]
    }

    const isMultipleFns = aggregationFunction.includes('+');
    if (isMultipleFns) {
      const [masterFn, childFn] = aggregationFunction.split('+');
      
      return [
        Sequelize.literal(`${masterFn.toUpperCase()}(${childFn.toUpperCase()}(${aggregationColumn}))`),
        aliasColumn,
        // Sequelize.fn(
        //   masterFn.toUpperCase(),
        //   Sequelize.literal(`${childFn.toUpperCase()}(${aggregationColumn})`),
        //   // [
        //   //   Sequelize.fn(
        //   //     childFn.toUpperCase(),
        //   //     Sequelize.col(aggregationColumn),
        //   //     aliasColumn,
        //   //   )
        //   // ],
        //   aliasColumn,
        // ),
      ];
    }

    const hasAdditionalParams: boolean = aggregationFunction.includes('-');
    if (hasAdditionalParams) {
      const [ aggregationFunctionExcludedHyphen , ...additionalParams ] = aggregationFunction.split('-').map(param => param.trim());
      return  [
        Sequelize.fn(
          aggregationFunctionExcludedHyphen.toUpperCase(),
          additionalParams.join(','),
          Sequelize.col(aggregationColumn),
        ),
        aliasColumn || aggregationColumn,
      ];
    }

    const aggregationAttribute: any[] = [
      Sequelize.fn(
        aggregationFunction.toUpperCase(),
        Sequelize.col(aggregationColumn),
      ),
      aliasColumn || aggregationColumn,
    ];

    return aggregationAttribute;
  }

  _parseAggregationColumnForGroupBy(aggretionColumn: string): any[] {
    const [aggregationFunction, aggregationColumn] = aggretionColumn.split(':').map(i => i.trim());

    const isRawQuery: boolean = aggregationFunction.startsWith('raw');
    if (isRawQuery) {
      return [
        Sequelize.literal(`${aggregationColumn}`),
      ];
    }
    const isMultipleFns = aggregationFunction.includes('+');
    if (isMultipleFns) {
      const [masterFn, childFn] = aggregationFunction.split('+');
      
      return [
        Sequelize.literal(`${masterFn.toUpperCase()}(${childFn.toUpperCase()}(${aggregationColumn}))`),
      ];
    }

    const hasAdditionalParams: boolean = aggregationFunction.includes('-');
    if (hasAdditionalParams) {
      const [ aggregationFunctionExcludedHyphen , ...additionalParams ] = aggregationFunction.split('-').map(param => param.trim());
      return  [
        Sequelize.fn(
          aggregationFunctionExcludedHyphen.toUpperCase(),
          additionalParams.join(','),
          Sequelize.col(aggregationColumn),
        ),
      ];
    }

    const aggregationAttribute: any[] = [
      Sequelize.fn(
        aggregationFunction.toUpperCase(),
        Sequelize.col(aggregationColumn),
      ),
    ];

    return aggregationAttribute;
  }

  _parseSort(sort: ISort): [string, string][] {
    if (!sort || !sort.column) return;
    
    const columns = sort.column.split(/[,]/).map(i => i.trim());
  
    const columnsWithAggregations: any[] = columns.map(column => {
      const isColumnSortingUsingAlias: boolean = column.includes('.') || column.includes('->');
      if (isColumnSortingUsingAlias) {
        return [
          ...column.replace(/->/g, '.').split('.'),
          sort.direction
        ];
      }

      const isAggregationColumn = column.includes(':');
      if (isAggregationColumn) {
        return this._parseAggregationColumnForSort(column, sort.direction);
      }

      return [column, sort.direction];
    });

    return columnsWithAggregations;
  }

  _parseAggregationColumnForSort(aggretionColumn: string, sortDirection = 'ASC'): any[] {
    const [aggregationFunction, aggregationColumn] = aggretionColumn.split(':').map(i => i.trim());
    
    const isRawQuery: boolean = aggregationFunction.startsWith('raw');
    if (isRawQuery) {
      return [
        Sequelize.literal(`${aggregationColumn}`),
        sortDirection.toUpperCase(),
      ];
    }
    const isMultipleFns = aggregationFunction.includes('+');
    if (isMultipleFns) {
      const [masterFn, childFn] = aggregationFunction.split('+');
      
      return [
        Sequelize.literal(`${masterFn.toUpperCase()}(${childFn.toUpperCase()}(${aggregationColumn}))`),
        sortDirection.toUpperCase(),
      ];
    }

    const aggregationAttribute: any[] = [
      Sequelize.fn(
        aggregationFunction.toUpperCase(),
        Sequelize.col(aggregationColumn),
      ),
      sortDirection.toUpperCase(),
    ];

    return aggregationAttribute;
  }

  _parseFilters(filters: IFilter[]): WhereOptions {
    const where: WhereOptions = {};

    filters.forEach(filter => {
      if (!filter.operator) { return; }
      const filterValue = filter.value || filter.values;

      switch (filter.operator.toLowerCase()) {
        case 'equals':
          where[filter.code] = this.getFilterValue(filterValue);
          break;
        case 'not_equals':
          where[filter.code] = { $not: this.getFilterValue(filterValue) };
          break;
        case 'contains':
          where[filter.code] = { $like: `%${this.getFilterValue(filterValue)}%` };
          break;
        case 'does_not_contain':
          where[filter.code] = { $notLike: `%${this.getFilterValue(filterValue)}%` };
          break;
        case 'contains_case_insensitive':
          where[filter.code] = { $iLike: `%${this.getFilterValue(filterValue)}%` };
          break;
        case 'does_not_contain_case_insensitive':
          where[filter.code] = { $notILike: `%${this.getFilterValue(filterValue)}%` };
          break;
        case 'starts_with':
          where[filter.code] = { $like: `${this.getFilterValue(filterValue)}%` };
          break;
        case 'ends_with':
          where[filter.code] = { $like: `%${this.getFilterValue(filterValue)}` };
          break;
        case 'in':
          where[filter.code] = { $in: this.getFilterValue(filterValue, true) };
          break;
        case 'not_in':
          where[filter.code] = { $notIn: this.getFilterValue(filterValue, true) };
          break;
        case 'is':
          where[filter.code] = { $in: this.getFilterValue(filterValue, true) };
          break;
        case 'is_not':
          where[filter.code] = { $notIn: this.getFilterValue(filterValue, true) };
          break;
        case 'array_contains':
          where[filter.code] = { $contains: this.getFilterValue(filterValue, true) };
          break;
        case 'is_greater_than':
          where[filter.code] = { $gte: this.getFilterValue(filterValue) };
          break;
        case 'is_smaller_than':
          where[filter.code] = { $lt: this.getFilterValue(filterValue) };
          break;
        case 'between':
          where[filter.code] = { $between: this.getFilterValue(filterValue, true) };
          break;
        case 'or': 
          where['$or'] = this._parseFilters(filterValue); 
          break;
        case 'and':
          where['$and'] = this._parseFilters(filterValue);
          break;
        default:
          throw new Error(`Operator ${filter.operator} not supported`);
      }
    });

    return where;
  }

  getFilterValue(filterValue: any, isMultipleValueOperator = false): any {
    if (isMultipleValueOperator) {
      if (!isArray(filterValue)) {
        throw new Error('Value must be array');
      }

      return filterValue;
    }

    if (isArray(filterValue)) {
      return filterValue[0];
    }

    return filterValue;
  }

  _parseIncludes(rawIncludes: IInclude[]): IncludeOptions[] {
    if (!rawIncludes || !rawIncludes.length) {
      return;
    }

    return rawIncludes.map(include => this._parseInclude(include));
  }

  _parseInclude(rawInclude: IInclude): IncludeOptions {
    if (!rawInclude || !rawInclude.field) {
      return;
    }

    const result: IncludeOptions = {
      association: rawInclude.field,
      attributes: {
        exclude: ['password'],
      },
    };

    if (rawInclude.required === true || rawInclude.required === false) {
      result.required = rawInclude.required;
    }

    if (rawInclude.select) {
      result.attributes = rawInclude.select;
    }

    if (rawInclude.filters) {
      result.where = this._parseFilters(rawInclude.filters);
    }

    if (rawInclude.includes) {
      result.include = rawInclude.includes.map(include => this._parseInclude(include));
    }

    return result;
  }

  _parseSearch(keyword: string): WhereOptions {
    if (/^\d{9}$/.test(keyword)) {
      // case keyword match id format
      return { id: Number(keyword) };
    } else {
      // case default is entity name
      return { name: { $iLike: `%${keyword}%` } };
    }
  }

  _addCondition(whereOptions: WhereOptions, condition): WhereOptions {
    if (!whereOptions) whereOptions = {};

    ObjectHelper.extend(whereOptions, condition);
    return whereOptions
  }

  _appendAnd(whereOptions: WhereOptions, key: string, value: any): WhereOptions {
    if (!whereOptions) whereOptions = {};

    if (whereOptions[key]) {
      whereOptions = { $and: [whereOptions, value] };
    } else {
      ObjectHelper.extend(whereOptions, value);
    }
    return whereOptions
  }

  _appendOr(whereOptions: WhereOptions, key: string, value: any): WhereOptions {
    if (!whereOptions) whereOptions = {};

    if (whereOptions[key]) {
      const oldVal = ObjectHelper.clone(whereOptions[key]);
      delete whereOptions[key];
      ObjectHelper.extend(whereOptions, {
        $or: [ObjectHelper.set({}, key, oldVal), value]
      });
    } else {
      ObjectHelper.extend(whereOptions, value);
    }

    return whereOptions
  }
}
