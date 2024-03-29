import monent from "moment";
import { ValueStatus } from "../RangePicker/enum";
/**
 * 将传入的 moment 对象转换为 时间戳形式
 */
const transformTimeStamp = (
  date: monent.Moment | null,
  valueStatus?: ValueStatus
): number | undefined => {
  if (!date) {
    return undefined;
  }

  switch (valueStatus) {
    case ValueStatus.Start:
      return date ? date.startOf("day").valueOf() : undefined;
    case ValueStatus.End:
      return date ? date.endOf("day").valueOf() : undefined;
    default:
      return date ? date.valueOf() : undefined;
  }
};

export { transformTimeStamp };
