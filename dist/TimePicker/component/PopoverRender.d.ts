import { Moment } from "moment";
import { TimeType } from "../enum";
interface Props {
    onChange: (tag: number) => void;
    rownum: Array<{
        value: number;
        disabled: boolean;
    }>;
    value: number;
    time?: Moment;
    timeType?: TimeType;
    disabledTime?: (currentData?: Moment) => boolean;
}
declare const PopoverRender: (props: Props) => JSX.Element;
export default PopoverRender;
