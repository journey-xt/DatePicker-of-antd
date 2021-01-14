import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { chunk } from "lodash";
import { fillTen } from "../../utils";
import PackTag from "./PackTag";

const Warp = styled.div`
  text-align: left;
  user-select: none;
  width: 182px;
`;

const RowTagWarp = styled.div`
  & .ant-tag:last-child {
    margin-right: 0;
  }
`;

interface Props {
  onChange: (tag: number) => void;
  rownum: Array<{ value: number; disabled: boolean }>;
  value: number;
}

const PopoverRender = (props: Props) => {
  const { onChange, rownum, value } = props;

  const tagChange = useCallback(
    (tag: number) => {
      if (onChange) {
        onChange(tag);
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
              checked={value === tag.value}
              onChange={tagChange}
            >
              {fillTen(tag.value)}
            </PackTag>
          ))}
        </RowTagWarp>
      ))}
    </Warp>
  );
};

export default PopoverRender;
