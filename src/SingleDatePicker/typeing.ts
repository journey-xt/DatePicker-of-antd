import { DatePickerProps } from "antd/lib/date-picker/interface.d";
import { Moment } from "moment/moment";
import { ValueType, ValueStatus, SelectMode } from "./enum";

export type PickerValue = string | number | Moment;

// 声明组件Props类型
export interface SingleDatePickerProps
  extends Omit<
    DatePickerProps,
    "format" | "disabledDate" | "value" | "onChange" | "open" | "onOpenChange"
  > {
  format?: string | string[];
  valueStatus?: ValueStatus;
  value?: string | number | Moment | Date;
  disabledDate?: (
    currentDate: Moment | undefined,
    valueStatus?: ValueStatus
  ) => boolean;
  valueType?: ValueType;
  onChange?: (value?: PickerValue, valueStatus?: ValueStatus) => void;
  showElement?: boolean;
  selectMode?: SelectMode;
}
