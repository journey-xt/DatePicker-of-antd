import React, { useState, useCallback, useEffect, useMemo } from "react";
import { get } from "lodash";
import { Row } from "antd";
import moment from "moment";
import { LayoutLeftCol, LayoutRightCol } from "./styled";

// 声明文件
import { Moment } from "moment/moment";
import { RangePickerValue, RangePickerProps } from "./typeing";

// 组件引用
import SingleDatePicker, {
  ValueStatus,
  ValueType,
  PickerValue,
  SelectMode
} from "../SingleDatePicker";

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
        placeholder[0] || "请选择开始时间",
        placeholder[1] || "请选择结束时间"
      ];
    }
    if (typeof placeholder === "string") {
      return [placeholder || "请选择开始时间", placeholder || "请选择结束时间"];
    }
    return ["请选择开始时间", "请选择开始时间"];
  }, [placeholder]);

  const [startFormat, endFormat] = useMemo(() => {
    if (typeof format === "string") {
      return [format, format];
    }
    if (Array.isArray(format)) {
      return format;
    }
    return ["YYYY-HH-MM", "YYYY-HH-MM"];
  }, [format]);

  const [RangeValue, setRangeValue] = useState<RangePickerValue>({
    [ValueStatus.Start]: undefined,
    [ValueStatus.End]: undefined
  });

  // 时间变化回调
  const rangeChange = useCallback(
    (value?: PickerValue, valueStatus?: ValueStatus) => {
      if (onChange) {
        onChange(
          value ||
            RangeValue[
              valueStatus === ValueStatus.Start
                ? ValueStatus.End
                : ValueStatus.Start
            ]
            ? {
                ...RangeValue,
                ...(valueStatus ? { [valueStatus]: value } : {})
              }
            : undefined
        );
      } else {
        setRangeValue(
          value ||
            RangeValue[
              valueStatus === ValueStatus.Start
                ? ValueStatus.End
                : ValueStatus.Start
            ]
            ? {
                ...RangeValue,
                ...(valueStatus ? { [valueStatus]: value } : {})
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

  // 不可选择时间回调
  const rangeDisabledDate = useCallback(
    (currentDate: Moment | undefined, valueStatus?: ValueStatus) => {
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

  // 上层porps变化
  useEffect(() => {
    setRangeValue({
      [ValueStatus.Start]: get(value, ValueStatus.Start, undefined),
      [ValueStatus.End]: get(value, ValueStatus.End, undefined)
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
            disabledDate={rangeDisabledDate}
            onChange={rangeChange}
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
            disabledDate={rangeDisabledDate}
            onChange={rangeChange}
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

export default React.forwardRef<any, RangePickerProps>(RangePicker);
