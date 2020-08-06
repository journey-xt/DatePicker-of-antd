import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import moment from "moment";
// 声明文件
import { Moment } from "moment/moment";
import { RangePickerValue } from "./typeing";
// 组件引用
import SingleDatePicker, {
  ValueStatus,
  ValueType,
  PickerValue,
  SelectMode,
} from "../SingleDatePicker";

const LayoutLeftCol = styled(Col)`
  position: relative;
  padding-right: 24px !important;
`;

const LayoutRightCol = styled(Col)`
  position: relative;
  padding-left: 0 !important;
`;

// 声明组件Props类型
interface Props {
  disabledDate?: (
    currentDate: Moment | undefined,
    valueStatus?: ValueStatus
  ) => boolean;
  valueStatus?: ValueStatus;
  format?: string | string[];
  valueType?: ValueType;
  onChange?: (value?: RangePickerValue) => void;
  showToday?: boolean;
  value?: RangePickerValue;
  selectMode?: SelectMode;
}

const RangePicker = (props: Props, ref: React.Ref<any>) => {
  const {
    showToday,
    onChange,
    value,
    disabledDate,
    selectMode,
    ...reset
  } = props;

  const [RangeValue, setRangeValue] = useState<RangePickerValue>({
    [ValueStatus.Start]: undefined,
    [ValueStatus.End]: undefined,
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
                ...(valueStatus ? { [valueStatus]: value } : {}),
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
                ...(valueStatus ? { [valueStatus]: value } : {}),
              }
            : {
                [ValueStatus.Start]: undefined,
                [ValueStatus.End]: undefined,
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
              return !currentDate.isBefore(moment(), "day") || endTime
                ? !currentDate.isBefore(endTime)
                : !currentDate.isBefore(moment(), "day");
            case SelectMode.BREFOREANDTODAY:
              return currentDate.isAfter(moment()) || endTime
                ? currentDate.isAfter(endTime)
                : currentDate.isAfter(moment());
            case SelectMode.AFTER:
              return currentDate.isBefore(moment()) || endTime
                ? currentDate.isBefore(endTime)
                : false;
            case SelectMode.TODYANDAFTER:
              return currentDate.isBefore(moment(), "day") || endTime
                ? currentDate.isBefore(endTime)
                : false;
            default:
              return false;
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
              return currentDate.isAfter(moment()) && startTime
                ? currentDate.isBefore(startTime)
                : false;
            default:
              return false;
          }
        default:
          return false;
      }
    },
    [RangeValue, disabledDate]
  );

  // 上层porps变化
  useEffect(
    () => {
      if (value !== undefined) {
        setRangeValue(value);
      } else {
        setRangeValue({
          [ValueStatus.Start]: undefined,
          [ValueStatus.End]: undefined,
        });
      }
    },
    [value]
  );

  return (
    <span {...reset}>
      <Row gutter={24}>
        <LayoutLeftCol span={12}>
          <SingleDatePicker
            showElement
            value={RangeValue[ValueStatus.Start]}
            valueStatus={ValueStatus.Start}
            disabledDate={rangeDisabledDate}
            onChange={rangeChange}
            showToday={showToday}
            valueType={ValueType.TimeStamp}
            suffixIcon
            defaultPickerValue={
              RangeValue[ValueStatus.Start]
                ? moment(RangeValue[ValueStatus.Start])
                : undefined
            }
          />
        </LayoutLeftCol>
        <LayoutRightCol span={12}>
          <SingleDatePicker
            value={RangeValue[ValueStatus.End]}
            valueStatus={ValueStatus.End}
            disabledDate={rangeDisabledDate}
            showToday={showToday}
            onChange={rangeChange}
            valueType={ValueType.TimeStamp}
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

export default React.forwardRef<any, Props>(RangePicker);
