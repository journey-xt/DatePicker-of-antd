import SingleDatePicker from "./SingleDatePicker";
import RangePicker from "./RangePicker";
import { ValueType, ValueStatus, SelectMode } from "./SingleDatePicker/enum";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export { RangePicker, ValueType, ValueStatus, SelectMode };
export default SingleDatePicker;
