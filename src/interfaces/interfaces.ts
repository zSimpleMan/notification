import { Transaction } from "sequelize";

export interface ICriteria {
  select?: any;
  filters?: IFilter[];
  sort?: ISort;
  page?: number;
  limit?: number;
  includes?: IInclude[];
  offset?: number;
  search?: string;
  groupBy?: string[];
  transaction?: Transaction;
}

export interface IFilter {
  code?: string;
  operator: Operator;
  value?: any;
  values?: any;
  codePrefix?: string;
}

export type Operator =
  | 'is_greater_than'
  | 'is_smaller_than'
  | 'contains'
  | 'does_not_contain'
  | 'contains_case_insensitive'
  | 'does_not_contain_case_insensitive'
  | 'is'
  | 'is_not'
  | 'in'
  | 'not_in'
  | 'equals'
  | 'not_equals'
  | 'does_not_equal'
  | 'array_contains'
  | 'starts_with'
  | 'ends_with'
  | 'between'
  | 'or'
  | 'and';

export interface ISort {
  column?: string;
  tablePrefix?: string;
  dimension?: string;
  direction?: string;
}

export interface IInclude {
  field: string;
  select?: string[];
  where?: any;
  required?: boolean;
  includes?: IInclude[];
  filters?: IFilter[];
}

export enum EntityStatus {
  Deleted = -1,
  Inactive = 0,
  Active = 1
}

export enum ACCOUNT_TYPES {
  Admin = 1,
  Company,
  Brand,
}
