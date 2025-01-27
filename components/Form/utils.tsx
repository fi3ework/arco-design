import cloneDeepWith from 'lodash/cloneDeepWith';
import lodashSet from 'lodash/set';
import { PropertyPath } from 'lodash';
import { isArray, isObject } from '../_util/is';
import { IndexedObject } from './interface';

export function cloneDeep(value) {
  // 只有对象才执行拷贝，否则直接返回。 如果是 File，MouseEvent对象，都可以直接返回
  return cloneDeepWith(value, (val) => {
    if (!isObject(val) && !isArray(val)) {
      return val;
    }
  });
}

export function set<T extends IndexedObject>(target: T, field: PropertyPath, value: any) {
  lodashSet(target, field, cloneDeep(value));
  return target;
}

// iteratively get all keys of object including nested objects
// e.g. const myObj = { a: { b: { c: [1,2] } } }
// iterativelyGetKeys(myObj) returns ['a.b.0.c.0', 'a.b.0.c.1']
// reference https://stackoverflow.com/a/47063174
export function iterativelyGetKeys(obj, prefix = '') {
  if (!obj) {
    return [];
  }
  return Object.keys(obj).reduce((res, el) => {
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...iterativelyGetKeys(obj[el], `${prefix + el}.`)];
    }
    return [...res, prefix + el];
  }, []);
}

// 判断是否是个事件对象 e?.constructor?.name 可能不是 SyntheticEvent，跟业务项目的打包方式有关系
export function isSyntheticEvent(e: any): boolean {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}
