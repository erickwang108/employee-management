import moment from 'moment';

export const hasProps = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export function calAge(date) {
  if (!date) {
    return 0;
  }

  return moment().diff(moment(date), 'years');
}

export function toMoments(dateList = []) {
  return dateList.map((d) => moment(d));
}

export function fmtDisplayText(val, splitter = '/', emptyReplacer = '-') {
  const vals = Array.isArray(val) ? val : [val];

  return vals.map((v) => v || emptyReplacer).join(splitter);
}

export function mergeValue(targetObj, key, value) {
  if (hasProps(targetObj, key)) {
    return ({
      ...targetObj,
      [key]: value,
    });
  }

  return targetObj;
}
