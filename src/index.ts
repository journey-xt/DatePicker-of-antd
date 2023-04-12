import SingleDatePicker from "./SingleDatePicker";
import RangePicker, { ValueStatus } from "./RangePicker";
import { SelectMode } from "./SingleDatePicker/enum";
import { ValueType } from "./enum/ValueType.enum";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export { RangePicker, ValueType, ValueStatus, SelectMode };
export default SingleDatePicker;
