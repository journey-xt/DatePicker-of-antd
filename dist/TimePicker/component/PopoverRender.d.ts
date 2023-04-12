import { Moment } from "moment";
interface Props {
    onChange: (tag: number) => void;
    rownum: Array<{
        value: number;
        disabled: boolean;
    }>;
    disabledDate?: Moment;
    value: number;
}
declare const PopoverRender: (props: Props) => JSX.Element;
export default PopoverRender;
