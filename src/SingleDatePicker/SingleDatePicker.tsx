import React, { useCallback, useState, useEffect, useMemo } from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import { transformMoment, transformTimeStamp } from "../utils";

// 声明文件
import { Moment } from "moment/moment";
import { SingleDatePickerProps } from "./typeing";
import { ValueType, ValueStatus, SelectMode } from "./enum";
import { PackDataPick } from "./styled";

moment.locale("zh-cn");

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
              return currentDate.isAfter(moment());
            case SelectMode.AFTER:
              return !currentDate.isAfter(moment(), "day");
            case SelectMode.BREFOREANDTODAY:
              return currentDate.isAfter(moment(), "day");
            case SelectMode.TODYANDAFTER:
              return currentDate.isBefore(moment(), "day");
            default:
              return false;
          }
        }
      }
      return false;
    },
    [disabledDate, selectMode, dateValue, valueStatus]
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
