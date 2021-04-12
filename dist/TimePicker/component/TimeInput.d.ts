/// <reference types="react" />
import { TimeType } from "../enum";
interface Props {
    timeType?: TimeType;
    max: number;
    step: number;
    value: number;
    format: string;
    onChange?: (value: number, type?: TimeType) => void;
}
declare const TimeInPut: (props: Props) => JSX.Element;
export default TimeInPut;
