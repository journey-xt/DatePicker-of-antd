import { HOUR, MINUTE, SEC } from "../constant";

export enum TimeType {
  /** 小时 */
  HOUR = "hour",

  /** 分 */
  MINUTE = "minute",

  /** 秒 */
  SECOND = "second"
}

export const TimeTypeObj = {
  [HOUR]: TimeType.HOUR,
  [MINUTE]: TimeType.MINUTE,
  [SEC]: TimeType.SECOND
};
