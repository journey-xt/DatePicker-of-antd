import { ValueType, ValueStatus } from "../DatePicker/SingleDatePicker/enum";
import { PickerValue } from "../DatePicker/SingleDatePicker/typeing";

export interface RangePickerValue {
  [ValueStatus.Start]: PickerValue | undefined;
  [ValueStatus.End]: PickerValue | undefined;
}
