import React, { useCallback } from "react";
import styled from "styled-components";
import { Tag } from "antd";

// @ts-ignore
const PackLayoutTag = styled(Tag.CheckableTag)<{ disabled: boolean }>`
  margin-bottom: 5px !important;
  background-color: ${props => props.disabled && "#f5f5f5 !important"};
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")}!important;
`;

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

const PackTag = (props: Props) => {
  const { onChange, tags, disabled, checked, children } = props;

  const tagSelected = useCallback(
    (checked: boolean) => {
      if (onChange && !disabled) {
        onChange(tags.value);
      }
    },
    [onChange]
  );

  return (
    <PackLayoutTag checked={checked} disabled={disabled} onChange={tagSelected}>
      {children}
    </PackLayoutTag>
  );
};

export default PackTag;
