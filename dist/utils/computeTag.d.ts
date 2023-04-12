import { Moment } from "moment";
import { TimeType } from "../TimePicker/enum";
export declare const computeTag: (max: number, step: number, timeType?: TimeType, time?: Moment, disabledDate?: Moment) => Array<{
    value: number;
    disabled: boolean;
}>;
