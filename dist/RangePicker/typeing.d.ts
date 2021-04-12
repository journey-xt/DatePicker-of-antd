import { Moment } from "moment/moment";
import { ValueStatus } from "../SingleDatePicker/enum";
import { PickerValue, SingleDatePickerProps } from "../SingleDatePicker/typeing";
export interface RangePickerValue {
    [ValueStatus.Start]: PickerValue | undefined;
    [ValueStatus.End]: PickerValue | undefined;
}
export interface RangePickerProps extends Omit<SingleDatePickerProps, "onChange" | "value" | "placeholder" | "showElement" | "disabledDate" | "showElement" | "format"> {
    disabledDate?: (currentDate: Moment | undefined, valueStatus?: ValueStatus) => boolean;
    format?: string | string[];
    onChange?: (value?: RangePickerValue) => void;
    value?: RangePickerValue;
    placeholder?: string | [string, string];
}
