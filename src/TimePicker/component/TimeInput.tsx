import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Popover, Input, InputNumber } from "antd";
import { TimeType } from "../enum";
import PopoverRender from "./PopoverRender";

const PackInput = styled(Input)`
  &.ant-input {
    display: inline-block;
    min-height: 38px;
    width: 50px;
    padding: 4px 16px;
  }
`;

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
  // type: TimeType;
  max: number;
  value: any;
  format: any;
}

const TimeInPut = (props: Props) => {
  const { value, format, max, ...reset } = props;

  // input dom
  const inputRef = useRef<HTMLInputElement | undefined>(undefined);

  // 标识 是否是点击数值变化
  const handleChange = useRef<boolean>(false);

  // popover 显示
  const [popoverVisible, setPopoverVisible] = useState(false);

  const onVisibleChange = useCallback(() => {}, []);

  const tagSlectedChange = useCallback(() => {}, []);

  const inputChange = useCallback(inputNumber => {
    console.log(inputNumber);
    if (handleChange) {
      handleChange.current = true;
    }
  }, []);

  // 获取焦点
  const inputFocus = useCallback(() => {
    console.log(111);
  }, []);

  // 失去焦点
  const inputBlur = useCallback(() => {
    if (handleChange) {
      handleChange.current = false;
    }
  }, []);

  const inputPressEnter = useCallback(() => {}, []);

  return (
    <Popover
      trigger="click"
      mouseEnterDelay={50}
      mouseLeaveDelay={0}
      visible={popoverVisible}
      getPopupContainer={triggerNode => triggerNode}
      autoAdjustOverflow
      onVisibleChange={onVisibleChange}
      overlayStyle={{ padding: "12px 4px" }}
      content={
        <PopoverRender
          {...reset}
          value={value}
          rownum={[]}
          onChange={tagSlectedChange}
        />
      }
      placement={format === "hh" ? "topLeft" : "top"}
    >
      <PackInputNumebr
        //   ref={inputRef}
        value={Number(value)}
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
