import { DatePickerProps } from "antd/lib/date-picker/interface.d";
import { Moment } from "moment/moment";
import { ValueType, ValueStatus, SelectMode } from "./enum";
export declare type PickerValue = string | number | Moment;
export interface SingleDatePickerProps extends Omit<DatePickerProps, "format" | "disabledDate" | "value" | "onChange"> {
    format?: string;
    valueStatus?: ValueStatus;
    value?: string | number | Moment;
    disabledDate?: (currentDate: Moment | undefined, valueStatus?: ValueStatus) => boolean;
    valueType?: ValueType;
    onChange?: (value?: PickerValue, valueStatus?: ValueStatus) => void;
    showElement?: boolean;
    selectMode?: SelectMode;
}
