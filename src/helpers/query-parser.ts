import { FindOptions, IncludeOptions, WhereOptions } from 'sequelize'
import { isArray } from 'lodash'
import { Sequelize } from 'sequelize-typescript'
import { ICriteria, IFilter, IInclude, ISort } from '../interfaces/interfaces';

export class SequelizeOptionsParser {

  parse(rawCriteria: ICriteria): FindOptions {
    let finalResult: FindOptions = {};

    if (!rawCriteria) {
      return finalResult;
    }

    const { select, filters, limit, page, includes, sort, search, groupBy, offset, ...otherCriterias } = rawCriteria;

    if (select && select.length) {
      finalResult.attributes = this._parseSelect(select);
    }

    if (groupBy && groupBy.length) {
      finalResult.group = this._parseGroupBy(groupBy);
    }

    if (filters && filters.length) {
      finalResult.where = this._parseFilters(filters);
    }

    if (limit && (page || offset !== undefined)) {
      finalResult.limit = limit;
      finalResult.offset = page ? (page - 1) * limit : offset;
    }

    const parsedInclude: IInclude[] = JSON.parse(includes.toString())
    if (parsedInclude && parsedInclude.length) {
      finalResult.include = this._parseIncludes(parsedInclude);
    }

    if (sort) {
      finalResult.order = this._parseSort(sort);
    }

    if (search) {
      finalResult.where = finalResult.where
        && Object.assign(finalResult.where, this._parseSearch(search))
        || this._parseSearch(search);
    }

    finalResult = {
      ...finalResult,
      ...otherCriterias,
    };
    
    return finalResult;
  }

  private _parseGroupBy(rawGroupBy: any): any[] {
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

  private _parseSelect(rawSelect: any): any[] {
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

  private _parseAggregationColumn(aggretionColumn: string): any[] {
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

  private _parseAggregationColumnForGroupBy(aggretionColumn: string): any[] {
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

  private _parseSort(sort: ISort): [string, string][] {
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

  private _parseAggregationColumnForSort(aggretionColumn: string, sortDirection = 'ASC'): any[] {
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

  private _parseFilters(filters: IFilter[]): WhereOptions {
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

  private getFilterValue(filterValue: any, isMultipleValueOperator = false): any {
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

  private _parseIncludes(rawIncludes: IInclude[]): IncludeOptions[] {
    if (!rawIncludes || !rawIncludes.length) {
      return;
    }

    return rawIncludes.map(include => this._parseInclude(include));
  }

  private _parseInclude(rawInclude: IInclude): IncludeOptions {
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

  private _parseSearch(keyword: string): WhereOptions {
    if (/^\d{9}$/.test(keyword)) {
      // case keyword match id format
      return { id: Number(keyword) };
    } else {
      // case default is entity name
      return { name: { $iLike: `%${keyword}%` } };
    }
  }
}
