import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { chunk } from "lodash";
import moment, { Moment } from "moment";
import { fillTen } from "../../utils";
import { TimeType } from "../enum";
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
  time?: Moment;
  timeType?: TimeType;
  disabledTime?: (currentData?: Moment) => boolean;
}

const PopoverRender = (props: Props) => {
  const { onChange, rownum, time, value, timeType, disabledTime } = props;

  const tagChange = useCallback(
    (tag: number) => {
      if (onChange) {
        onChange(tag);
      }
    },
    [onChange]
  );

  const disabled = useCallback((val: number, timeType?: TimeType) => {
    if (disabledTime) {
      if (timeType && time) {
        return disabledTime(time.set(timeType, val));
      }

      return disabledTime();
    }

    return false;
  }, []);

  const chunkRownum = useMemo(() => chunk(rownum, 5), [rownum]);

  return (
    <Warp>
      {chunkRownum.map((item, index) => (
        <RowTagWarp key={index}>
          {item.map(tag => (
            <PackTag
              key={tag.value}
              tags={tag}
              disabled={disabled(tag.value, timeType)}
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
