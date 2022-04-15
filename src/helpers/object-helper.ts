import * as _ from 'lodash';

export class ObjectHelper {
  static omitByUndefined(object: any): any {
    return _.omitBy(object, _.isUndefined);
  }

  static pick(object: any, ...props: any[]): any {
    return _.pick(object, ...props);
  }

  static cloneDeep(value: any): any {
    return _.cloneDeep(value);
  }

  static isEqual(value: any, other: any): boolean {
    return _.isEqual(value, other);
  }

  static extend(obj: {}, src: {}): {} {
    return _.extend(obj, src);
  }

  static clone(value: {}): {} {
    return _.clone(value);
  }

  static set(object: {}, path: _.Many<string | number | symbol>, value: any): {} {
    return _.set(object, path, value);
  }

  static forOwn(value : any , callback){
    return _.forOwn(value , callback)
  }

  static values<T extends object>(object: T | null | undefined): Array<T[keyof T]> {
    return _.values(object);
  }
  static isEmpty(value : any) : boolean{
    return _.isEmpty(value);
  }
}
