import moment, { Moment } from "moment";
import { TimeType } from "./enum";
interface Props {
    format: string;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    value?: string | number | Moment | null;
    disabledTime?: (currentData?: Moment, timeType?: TimeType) => boolean;
    onChange?: (date: moment.Moment) => void;
}
declare const TimePicker: (props: Props) => JSX.Element;
export default TimePicker;
