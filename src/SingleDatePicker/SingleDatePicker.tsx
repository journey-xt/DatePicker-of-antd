import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Button } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import TimePicker from "../TimePicker";
import { transformMoment } from "../utils";
import { pattern } from "../tools/regex";

// 声明文件
import { Moment } from "moment/moment";
import { SingleDatePickerProps } from "./typeing";
import { SelectMode } from "./enum";
import { ValueType } from "../enum/ValueType.enum";
import { PackDataPick, RenderTimeWarp } from "./styled";

moment.locale("zh-cn");

const SingleDatePicker = (
  props: SingleDatePickerProps,
  ref: React.Ref<any>
) => {
  const {
    format = "YYYY-MM-DD",
    valueType = ValueType.TimeStamp,
    value,
    defaultPickerValue,
    onChange,
    disabledDate,
    selectMode,
    open = false,
    onOpenChange: upOnOpenChange,
    ...reset
  } = props;

  const [dateValue, setDateValue] = useState(transformMoment(value, format));

  const [defaultValue, setDefaultValue] = useState(
    transformMoment(moment(), format)
  );

  // 面板 open
  const [datePanelOpen, setDatePanelOpen] = useState(open);

  // 时、分、秒 format
  const timeFormat = useMemo(() => {
    const match = format.match(pattern.TimeFormat);

    if (match && Array.isArray(match)) {
      return match[0];
    }

    return undefined;
  }, [format]);

  // 变化回调
  const dateChange = useCallback(
    (date: Moment | null) => {
      if (onChange) {
        switch (valueType) {
          case ValueType.TimeStamp:
            onChange(date ? moment(date.format(format)).valueOf() : undefined);
            break;
          case ValueType.TimeString:
            onChange(date ? date.format(format) : undefined);
            break;
          case ValueType.Moment:
          default:
            onChange(date ? moment(date.format(format)).valueOf() : undefined);
        }
      } else {
        setDateValue(transformMoment(date, format));
      }

      if (timeFormat) {
        setDatePanelOpen(true);
      }
    },
    [onChange, valueType, timeFormat, format]
  );

  // 不可选择时间回调
  const disabledTime = useCallback(
    (currentDate: Moment | undefined) => {
      // 传递外层API 禁用日期
      if (disabledDate && currentDate) {
        return disabledDate(currentDate);
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
    [disabledDate, selectMode, dateValue]
  );

  // timePicker 变化回调
  const timePickerChange = useCallback(
    (timeValue: moment.Moment) => {
      dateChange(timeValue);
    },
    [dateChange]
  );

  // 关闭 datepanel
  const closePanel = useCallback(() => {
    dateChange(dateValue || defaultValue || null);
    setDatePanelOpen(false);
  }, [setDatePanelOpen, dateChange, dateValue, defaultValue]);

  // 添加额外的的页脚render
  // 需要选择 时分秒生成
  const renderExtraFooter = useCallback(() => {
    if (timeFormat) {
      return (
        <RenderTimeWarp>
          <TimePicker
            format={timeFormat}
            onChange={timePickerChange}
            value={dateValue || defaultValue}
          />
          <Button size="small" type="primary" onClick={closePanel}>
            确定
          </Button>
        </RenderTimeWarp>
      );
    }
    return null;
  }, [timeFormat, dateValue, defaultValue, timePickerChange, closePanel]);

  // 时间组件面板 切换回调
  const onOpenChange = useCallback(
    (status: boolean) => {
      if (status && !dateValue) {
        setDefaultValue(moment());
      }
      if (upOnOpenChange) {
        return upOnOpenChange(status);
      }

      setDatePanelOpen(status);
    },
    [upOnOpenChange, setDatePanelOpen, setDefaultValue, dateValue]
  );

  useEffect(() => {
    setDateValue(transformMoment(value, format));
  }, [format, value]);

  return (
    <PackDataPick
      {...reset}
      ref={ref}
      open={datePanelOpen}
      format={format}
      value={dateValue}
      defaultPickerValue={defaultValue}
      onChange={dateChange}
      disabledDate={disabledTime}
      onOpenChange={onOpenChange}
      renderExtraFooter={renderExtraFooter}
    />
  );
};

export default React.forwardRef<any, any>(SingleDatePicker);
