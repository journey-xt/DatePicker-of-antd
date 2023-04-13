import React, { useState, useCallback, useEffect, useMemo } from "react";
import { get } from "lodash";
import { Row } from "antd";
import moment from "moment";
import { LayoutLeftCol, LayoutRightCol } from "./styled";

// 声明文件
import { Moment } from "moment/moment";
import { RangePickerValue, RangePickerProps } from "./typeing";
import { Placeholder } from "../enum/Placeholder.enum";
import { FormatDefault } from "../enum/FormatDefault.enum";
import { ValueStatus } from "./enum";
import { ValueType } from "../enum/ValueType.enum";
import { TimeType } from "../TimePicker";

// 组件引用
import SingleDatePicker, { PickerValue, SelectMode } from "../SingleDatePicker";

const RangePicker = (props: RangePickerProps, ref: React.Ref<any>) => {
  const {
    id,
    name,
    format,
    onChange,
    value,
    disabledDate,
    selectMode,
    placeholder,
    valueType = ValueType.TimeStamp,
    ...reset
  } = props;

  const [startPlaceholder, endPlaceholder] = useMemo(() => {
    if (placeholder && Array.isArray(placeholder)) {
      return [
        placeholder[0] || Placeholder.START,
        placeholder[1] || Placeholder.END
      ];
    }
    if (typeof placeholder === "string") {
      return [placeholder || Placeholder.START, placeholder || Placeholder.END];
    }
    return [Placeholder.START, Placeholder.END];
  }, [placeholder]);

  const [startFormat, endFormat] = useMemo(() => {
    if (typeof format === "string") {
      return [format, format];
    }
    if (Array.isArray(format)) {
      return format;
    }
    return [
      `${FormatDefault.FORMAT_DEFAULT}`,
      `${FormatDefault.FORMAT_DEFAULT}`
    ];
  }, [format]);

  const [RangeValue, setRangeValue] = useState<RangePickerValue>({
    [ValueStatus.Start]: undefined,
    [ValueStatus.End]: undefined
  });

  // 时间变化回调
  const rangeChange = useCallback(
    (valueStatus: ValueStatus, value?: PickerValue) => {
      if (onChange) {
        console.log(value);

        const startTime = RangeValue[ValueStatus.Start];
        const endTime = RangeValue[ValueStatus.End];

        if (valueStatus === ValueStatus.Start) {
          if (endTime && value && moment(value).isAfter(moment(endTime), "s")) {
            return;
          }
        }

        if (valueStatus === ValueStatus.End) {
          if (
            startTime &&
            value &&
            moment(value).isBefore(moment(startTime), "s")
          ) {
            return;
          }
        }
        onChange(
          value || RangeValue[valueStatus]
            ? {
                ...RangeValue,
                [valueStatus]: value
              }
            : undefined
        );
      } else {
        setRangeValue(
          value || RangeValue[valueStatus]
            ? {
                ...RangeValue,
                [valueStatus]: value
              }
            : {
                [ValueStatus.Start]: undefined,
                [ValueStatus.End]: undefined
              }
        );
      }
    },
    [onChange, RangeValue]
  );

  // 开始时间变化回调
  const startDateChange = useCallback(
    (value?: PickerValue) => {
      rangeChange(ValueStatus.Start, value);
    },
    [rangeChange]
  );

  // 结束时间变化回调
  const endDateChange = useCallback(
    (value?: PickerValue) => {
      rangeChange(ValueStatus.End, value);
    },
    [rangeChange]
  );

  // 不可选择日期回调
  const rangeDisabledDate = useCallback(
    (currentDate: Moment | undefined, valueStatus: ValueStatus) => {
      // 上层 不可选择时间段 回调
      if (disabledDate) {
        return disabledDate(currentDate, valueStatus);
      }

      const startTime = RangeValue[ValueStatus.Start];
      const endTime = RangeValue[ValueStatus.End];

      if (!currentDate) {
        return true;
      }

      switch (valueStatus) {
        case ValueStatus.Start:
          switch (selectMode) {
            case SelectMode.BREFORE:
              return endTime
                ? !currentDate.isBefore(moment(), "day") ||
                    !currentDate.isBefore(endTime, "day")
                : !currentDate.isBefore(moment(), "day");
            case SelectMode.BREFOREANDTODAY:
              return currentDate.isAfter(moment()) || endTime
                ? currentDate.isAfter(endTime)
                : currentDate.isAfter(moment());
            case SelectMode.AFTER:
              return endTime
                ? currentDate.isBefore(moment()) || currentDate.isAfter(endTime)
                : currentDate.isBefore(moment());
            case SelectMode.TODYANDAFTER:
              return endTime
                ? currentDate.isBefore(moment(), "day") ||
                    currentDate.isAfter(endTime)
                : currentDate.isBefore(moment(), "day");
            default:
              return endTime ? currentDate.isAfter(moment(endTime)) : false;
          }
        case ValueStatus.End:
          switch (selectMode) {
            case SelectMode.BREFORE:
              const brefore = !currentDate.isBefore(moment(), "day");
              return startTime
                ? brefore || currentDate.isBefore(startTime)
                : brefore;
            case SelectMode.BREFOREANDTODAY:
              const breforeAndToday = !currentDate.isBefore(moment());
              return startTime
                ? breforeAndToday || currentDate.isBefore(startTime)
                : breforeAndToday;
            case SelectMode.AFTER:
              const after = currentDate.isBefore(moment());
              return startTime
                ? after || currentDate.isBefore(startTime)
                : after;
            case SelectMode.TODYANDAFTER:
              return startTime
                ? currentDate.isBefore(startTime)
                : currentDate.isBefore(moment(), "day");
            default:
              return startTime
                ? currentDate.isBefore(moment(startTime))
                : false;
          }
        default:
          return false;
      }
    },
    [RangeValue, disabledDate]
  );

  // 不可选择时间回调
  const rangeDisabledTime = useCallback(
    (
      currentDate: Moment | undefined,
      valueStatus: ValueStatus,
      timeType?: TimeType
    ) => {
      // 上层 不可选择时间段 回调
      if (disabledDate) {
        return disabledDate(currentDate, valueStatus);
      }

      const startTime = RangeValue[ValueStatus.Start];
      const endTime = RangeValue[ValueStatus.End];

      if (!currentDate) {
        return true;
      }

      switch (valueStatus) {
        case ValueStatus.Start:
          switch (selectMode) {
            case SelectMode.BREFORE:
              return endTime
                ? !currentDate.isBefore(moment(), timeType) ||
                    !currentDate.isBefore(endTime, timeType)
                : !currentDate.isBefore(moment(), timeType);
            case SelectMode.BREFOREANDTODAY:
              return currentDate.isAfter(moment()) || endTime
                ? currentDate.isAfter(endTime)
                : currentDate.isAfter(moment());
            case SelectMode.AFTER:
              return endTime
                ? currentDate.isBefore(moment()) || currentDate.isAfter(endTime)
                : currentDate.isBefore(moment());
            case SelectMode.TODYANDAFTER:
              return endTime
                ? currentDate.isBefore(moment(), timeType) ||
                    currentDate.isAfter(endTime)
                : currentDate.isBefore(moment(), timeType);
            default:
              return endTime ? currentDate.isAfter(moment(endTime)) : false;
          }
        case ValueStatus.End:
          switch (selectMode) {
            case SelectMode.BREFORE:
              const brefore = !currentDate.isBefore(moment(), timeType);
              return startTime
                ? brefore || currentDate.isBefore(startTime)
                : brefore;
            case SelectMode.BREFOREANDTODAY:
              const breforeAndToday = !currentDate.isBefore(moment());
              return startTime
                ? breforeAndToday || currentDate.isBefore(startTime)
                : breforeAndToday;
            case SelectMode.AFTER:
              const after = currentDate.isBefore(moment());
              return startTime
                ? after || currentDate.isBefore(startTime)
                : after;
            case SelectMode.TODYANDAFTER:
              return startTime
                ? currentDate.isBefore(startTime)
                : currentDate.isBefore(moment(), timeType);
            default:
              return startTime
                ? currentDate.isBefore(moment(startTime))
                : false;
          }
        default:
          return false;
      }
    },
    [RangeValue, disabledDate]
  );

  // 开始时间变化回调
  const startDateDisabledDate = useCallback(
    (currentDate: Moment | undefined) =>
      rangeDisabledDate(currentDate, ValueStatus.Start),
    [rangeDisabledDate]
  );

  // 结束时间变化回调
  const endDateDisabledDate = useCallback(
    (currentDate: Moment | undefined) =>
      rangeDisabledDate(currentDate, ValueStatus.End),
    [rangeDisabledDate]
  );

  // 开始时间变化回调
  const startDateDisabledTime = useCallback(
    (currentDate: Moment | undefined, timeType?: TimeType) =>
      rangeDisabledTime(currentDate, ValueStatus.Start, timeType),
    [rangeDisabledTime]
  );

  // 结束时间变化回调
  const endDateDisabledTime = useCallback(
    (currentDate: Moment | undefined, timeType?: TimeType) =>
      rangeDisabledTime(currentDate, ValueStatus.End, timeType),
    [rangeDisabledTime]
  );

  // 上层porps变化
  useEffect(() => {
    setRangeValue({
      [ValueStatus.Start]: get(value, ValueStatus.Start),
      [ValueStatus.End]: get(value, ValueStatus.End)
    });
  }, [setRangeValue, value]);

  return (
    <span {...(id ? { id: `${id}` } : {})} {...(name ? { name } : {})}>
      <Row gutter={24}>
        <LayoutLeftCol span={12}>
          <SingleDatePicker
            {...reset}
            showElement
            format={startFormat}
            value={RangeValue[ValueStatus.Start]}
            valueStatus={ValueStatus.Start}
            disabledDate={startDateDisabledDate}
            disabledTime={startDateDisabledTime}
            onChange={startDateChange}
            placeholder={startPlaceholder}
            defaultPickerValue={
              RangeValue[ValueStatus.Start]
                ? moment(RangeValue[ValueStatus.Start])
                : undefined
            }
          />
        </LayoutLeftCol>
        <LayoutRightCol span={12}>
          <SingleDatePicker
            {...reset}
            format={endFormat}
            value={RangeValue[ValueStatus.End]}
            valueStatus={ValueStatus.End}
            disabledDate={endDateDisabledDate}
            disabledTime={endDateDisabledTime}
            onChange={endDateChange}
            placeholder={endPlaceholder}
            defaultPickerValue={
              RangeValue[ValueStatus.Start]
                ? moment(RangeValue[ValueStatus.Start])
                : undefined
            }
          />
        </LayoutRightCol>
      </Row>
    </span>
  );
};

export default React.forwardRef<any, any>(RangePicker);
