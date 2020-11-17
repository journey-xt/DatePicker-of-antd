import React, { useCallback, useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { DatePicker } from "antd";
// import {} from "antd/lib/date-picker/";
import moment from "moment";
import "moment/locale/zh-cn";
import { transformMoment, transformTimeStamp } from "../utils";

// 声明文件
import { Moment } from "moment/moment";
import { PickerValue } from "./typeing";
import { ValueType, ValueStatus, SelectMode } from "./enum";

moment.locale("zh-cn");

const afterCss = css`
  content: "~";
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -24px;
  top: 0;
  height: 100%;
  width: 24px;
  // background: #fff;
`;

const PackDataPick = styled(DatePicker)<{ showElement?: boolean }>`
  position: relative;
  width: 100%;
  & .ant-input {
    //  border: 1px solid transparent;
  }
  &:after {
    ${props => (props.showElement ? afterCss : "")}
  }
`;

// 声明组件Props类型
export interface SingleDatePickerProps {
  format?: string | string[];
  //  showTime?: boolean;
  valueStatus?: ValueStatus;
  value?: string | number | Moment | Date;
  disabledDate?: (
    currentDate: Moment | undefined,
    valueStatus?: ValueStatus
  ) => boolean;
  valueType?: ValueType;
  onChange?: (value?: PickerValue, valueStatus?: ValueStatus) => void;
  defaultPickerValue?: Moment;
  showToday?: boolean;
  suffixIcon?: React.ReactNode | null;
  showElement?: boolean;
  selectMode?: SelectMode;
  placeholder?: string;
}

const SingleDatePicker = (
  props: SingleDatePickerProps,
  ref: React.Ref<any>
) => {
  const {
    // format = "YYYY-MM-DD",
    valueStatus = ValueStatus.Start,
    valueType = ValueType.TimeStamp,
    value,
    onChange,
    defaultPickerValue,
    disabledDate,
    selectMode,
    ...reset
  } = props;

  const [dateValue, setDateValue] = useState(transformMoment(value));

  // 当前时间
  const [currentMoment, SetCurrentMoment] = useState(moment());

  // 变化回调
  const dateChange = useCallback(
    (date: Moment | null, dateString?: string) => {
      if (onChange) {
        switch (valueType) {
          case ValueType.TimeStamp:
            return onChange(transformTimeStamp(date, valueStatus), valueStatus);
          case ValueType.TimeString:
            return onChange(dateString, valueStatus);
          case ValueType.Moment:
          default:
            return onChange(date || undefined, valueStatus);
        }
      } else {
        setDateValue(transformMoment(value));
      }
    },
    [onChange, valueType, valueStatus]
  );

  // 不可选择时间回调
  const disabledTime = useCallback(
    (currentDate: Moment | undefined) => {
      // 传递外层API 禁用日期
      if (disabledDate && currentDate) {
        return disabledDate(currentDate, valueStatus);
      }
      if (currentDate) {
        if (selectMode) {
          switch (selectMode) {
            case SelectMode.BREFORE:
              return currentDate.isAfter(currentMoment);
            case SelectMode.AFTER:
              return !currentDate.isAfter(currentMoment, "day");
            case SelectMode.BREFOREANDTODAY:
              return currentDate.isAfter(currentMoment, "day");
            case SelectMode.TODYANDAFTER:
              return currentDate.isBefore(currentMoment, "day");
            default:
              return false;
          }
        }
      }
      return false;
    },
    [disabledDate, selectMode, dateValue, valueStatus, currentMoment]
  );

  useEffect(() => {
    setDateValue(transformMoment(value));
  }, [value]);

  return (
    <PackDataPick
      {...reset}
      value={dateValue}
      onChange={dateChange}
      disabledDate={disabledTime}
      defaultPickerValue={defaultPickerValue}
    />
  );
};

export default React.forwardRef<any, SingleDatePickerProps>(SingleDatePicker);
