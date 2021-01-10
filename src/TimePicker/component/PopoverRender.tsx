import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { chunk } from "lodash";
import PackTag from "./PackTag";

const Warp = styled.div`
  text-align: left;
  user-select: none;
`;

const RowTagWarp = styled.div`
  & .ant-tag:last-child {
    margin-right: 0;
  }
`;

interface Props {
  onChange: (tag: any, checked: boolean) => void;
  rownum: Array<{ value: string; disabled: boolean }>;
  value: any;
}

const PopoverRender = (props: Props) => {
  const { onChange, rownum, value } = props;

  const tagChange = useCallback(
    (tag: any, checked: boolean) => {
      if (onChange) {
        onChange(tag, checked);
      }
    },
    [onChange]
  );

  const chunkRownum = useMemo(() => chunk(rownum, 5), [rownum]);

  return (
    <Warp>
      {chunkRownum.map((item, index) => (
        <RowTagWarp key={index}>
          {item.map(tag => (
            <PackTag
              key={tag.value}
              tags={tag}
              disabled={tag.disabled}
              checked={Number(value) === Number(tag.value)}
              onChange={tagChange}
            >
              {tag.value}
            </PackTag>
          ))}
        </RowTagWarp>
      ))}
    </Warp>
  );
};

export default PopoverRender;
