import moment, { Moment } from "moment";
interface Props {
    format: string;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    value?: string | number | Moment | null;
    disabledTime?: (currentData?: Moment) => boolean;
    onChange?: (date: moment.Moment) => void;
}
declare const TimePicker: (props: Props) => JSX.Element;
export default TimePicker;
