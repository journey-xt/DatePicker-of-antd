import { Moment } from "moment";
import { TimeType } from "../enum";
interface Props {
    timeType?: TimeType;
    time?: Moment;
    max: number;
    step: number;
    value: number;
    format: string;
    disabledTime?: (currentData?: Moment, timeType?: TimeType) => boolean;
    onChange?: (value: number, type?: TimeType) => void;
}
declare const TimeInPut: (props: Props) => JSX.Element;
export default TimeInPut;
