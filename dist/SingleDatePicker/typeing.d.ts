import { DatePickerProps } from "antd/lib/date-picker/interface.d";
import { Moment } from "moment/moment";
import { ValueType } from "../enum/ValueType.enum";
import { SelectMode } from "./enum";
import { TimeType } from "../TimePicker";
export declare type PickerValue = string | number | Moment;
export interface SingleDatePickerProps extends Omit<DatePickerProps, "format" | "disabledDate" | "value" | "onChange" | "disabledTime"> {
    format?: string;
    value?: string | number | Moment;
    disabledDate?: (currentDate: Moment | undefined) => boolean;
    valueType?: ValueType;
    onChange?: (value?: PickerValue) => void;
    showElement?: boolean;
    selectMode?: SelectMode;
    disabledTime?: (currentDate?: Moment, timeType?: TimeType) => boolean;
}
