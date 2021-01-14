import React, { useCallback, useRef, useMemo } from "react";
import styled from "styled-components";
import { Popover, Input, InputNumber } from "antd";
import { TimeType } from "../enum";
import PopoverRender from "./PopoverRender";
import { computeTag } from "../../utils";

const PackInputNumebr = styled(InputNumber)`
  &.ant-input-number {
    display: inline-block;
    min-height: 38px;
    width: 50px;
    padding: 4px 0px;
  }
  & .ant-input-number-input {
    width: 50px;
  }
`;

interface Props {
  timeType: TimeType;
  max: number;
  step: number;
  value: number;
  format: string;
  onChange?: (value: number, type: TimeType) => void;
}

const TimeInPut = (props: Props) => {
  const { timeType, value, format, max, step, onChange, ...reset } = props;

  // input dom
  const inputRef = useRef<InputNumber | null>(null);

  const tagSlectedChange = useCallback(
    (tag: number) => {
      if (onChange) {
        onChange(tag || 0, timeType);
      }
    },
    [timeType]
  );

  const inputChange = useCallback(
    (inputNumber: number | undefined) => {
      if (onChange && inputNumber && inputNumber <= max) {
        onChange(inputNumber, timeType);
      }
    },
    [onChange, timeType, max]
  );

  // 获取焦点
  const inputFocus = useCallback(() => {
    if (
      inputRef &&
      inputRef.current &&
      // @ts-ignore
      inputRef.current.inputNumberRef &&
      // @ts-ignore
      inputRef.current.inputNumberRef.input
    ) {
      // @ts-ignore
      inputRef.current.inputNumberRef.input.select();
    }
  }, []);

  const rownum = useMemo(() => computeTag(max, step), [max, step]);

  // 失去焦点
  const inputBlur = useCallback(() => {}, []);

  const inputPressEnter = useCallback(() => {}, []);

  return (
    <Popover
      trigger="click"
      mouseEnterDelay={50}
      mouseLeaveDelay={0}
      getPopupContainer={triggerNode => triggerNode}
      autoAdjustOverflow
      overlayStyle={{ padding: "12px 4px" }}
      content={
        <PopoverRender
          {...reset}
          value={value}
          rownum={rownum}
          onChange={tagSlectedChange}
        />
      }
    >
      <PackInputNumebr
        ref={inputRef}
        value={value}
        max={max}
        min={0}
        onChange={inputChange}
        onFocus={inputFocus}
        onBlur={inputBlur}
        onPressEnter={inputPressEnter}
      />
    </Popover>
  );
};

export default TimeInPut;
