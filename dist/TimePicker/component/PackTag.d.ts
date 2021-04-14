interface ITag {
    value: number;
    disabled: boolean;
}
interface Props {
    onChange: (tag: number) => void;
    tags: ITag;
    checked: boolean;
    children: string;
    disabled: boolean;
}
declare const PackTag: (props: Props) => JSX.Element;
export default PackTag;
