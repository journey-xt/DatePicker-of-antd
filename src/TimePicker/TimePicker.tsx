import React, { useCallback, useMemo } from "react";
import { Button } from "antd";
import styled from "styled-components";
import moment, { Moment } from "moment";
import { memoize } from "lodash";
import TimeInput from "./component/TimeInput";
import { pattern } from "../tools/regex";
// import { TimeFormat } from "./index.d";
import { TIMEFORMAT, HOUR, MINUTE, SEC, HMS } from "../constant";
import { matchTimeFormat, fillTen, transformMoment } from "../utils";

const Warp = styled.div`
  padding: 5px 0;
`;

interface Props {
  format: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  value?: string | number | Moment | Date;
  disabledHours?: () => Array<number>;
  disabledMinutes?: () => Array<number>;
  disabledSeconds?: () => Array<number>;
  // timePickerOnOpenChange: (status: boolean) => void;
  // datePickerOnOpenChange: (status: boolean) => void;
}

interface Step {
  step: number;
  max: number;
  value: string;
  // disabledTime: () => void;
  hour?: number;
  minute?: number;
}

const TimePicker = (props: Props) => {
  const {
    format,
    value,
    hourStep = 1,
    minuteStep = 5,
    secondStep = 10,
    disabledHours,
    disabledMinutes,
    disabledSeconds
  } = props;

  const timeItemProps: (timeType: string) => Step = useCallback(
    (timeType: string) => {
      const hour = moment(value).hour();
      const minute = moment(value).minute();
      const second = moment(value).second();

      switch (timeType) {
        case MINUTE: // 为分钟的input框的值
          return {
            step: minuteStep,
            max: 60,
            value: fillTen(minute),
            //    disabledTime: disabledMinutes,
            hour,
            minute
          };
        case SEC: // 为秒的input框的值
          return {
            step: secondStep,
            max: 60,
            value: fillTen(second),
            //    disabledTime: disabledSeconds,
            hour,
            minute
          };
        case HOUR: // 为小时的input框的值
        default:
          // 默认为  小时
          return {
            step: hourStep,
            max: 24,
            value: fillTen(hour),
            //      disabledTime: disabledHours,
            hour,
            minute
          };
      }
    },
    [
      format,
      value,
      hourStep,
      minuteStep,
      secondStep,
      disabledHours,
      disabledMinutes,
      disabledSeconds
    ]
  );

  // 返回分隔符号
  const splitSymbol = useMemo(() => {
    const match = matchTimeFormat(format);
    if (match && Array.isArray(match)) {
      return match[2];
    }
    return "";
  }, [format]);

  // 后缀
  const renderSuffix = useCallback(timeType => {
    const font = TIMEFORMAT.find(item => item.format === timeType);
    if (font) {
      return font.des;
    }
    return "-";
  }, []);

  const timeGroup = useMemo(() => format.split(splitSymbol), [splitSymbol]);

  return (
    <Warp>
      {timeGroup.map(item => (
        <span key={item}>
          <TimeInput format={item} {...timeItemProps(item)} />
          {renderSuffix(item)}
        </span>
      ))}
    </Warp>
  );
};

export default TimePicker;
