import { Moment } from "moment";
import { TimeType } from "../TimePicker/enum";

// 判断时间是否满足要求
const disableTime = (
  timeValue: number,
  timeType?: TimeType,
  time?: Moment,
  disabledDate?: Moment
) => {
  if (disabledDate && time && timeType) {
    return time.set(timeType, timeValue).isBefore(disabledDate);
  }

  return false;
};

export const computeTag: (
  max: number,
  step: number,
  timeType?: TimeType,
  time?: Moment,
  disabledDate?: Moment
) => Array<{ value: number; disabled: boolean }> = (
  max,
  step,
  timeType,
  time,
  disabledDate
) => {
  const array: Array<{ value: number; disabled: boolean }> = [];
  let i = 0;
  while (i < max) {
    /* eslint-disable no-loop-func */
    array.push({
      value: i,
      disabled: disableTime(i, timeType, time, disabledDate)
    });
    /* eslint-enable no-loop-func */
    i += step;
  }
  return array;
};
