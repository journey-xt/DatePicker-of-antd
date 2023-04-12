import { Moment } from "moment";
import { TimeType } from "../enum";
interface Props {
    timeType?: TimeType;
    time?: Moment;
    max: number;
    step: number;
    value: number;
    format: string;
    disabledDate?: Moment;
    onChange?: (value: number, type?: TimeType) => void;
}
declare const TimeInPut: (props: Props) => JSX.Element;
export default TimeInPut;
