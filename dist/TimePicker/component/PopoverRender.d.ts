/// <reference types="react" />
interface Props {
    onChange: (tag: number) => void;
    rownum: Array<{
        value: number;
        disabled: boolean;
    }>;
    value: number;
}
declare const PopoverRender: (props: Props) => JSX.Element;
export default PopoverRender;
