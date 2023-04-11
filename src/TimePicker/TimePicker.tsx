import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import moment, { Moment } from "moment";
import TimeInput from "./component/TimeInput";
import { TimeType } from "./enum";
import { TIMEFORMAT, HOUR, MINUTE, SEC } from "../constant";
import { matchTimeFormat, transformMoment } from "../utils";

const Warp = styled.div`
  padding: 5px 0;
`;

interface Props {
  format: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  value?: string | number | Moment | null;
  disabledHours?: () => Array<number>;
  disabledMinutes?: () => Array<number>;
  disabledSeconds?: () => Array<number>;
  onChange?: (date: moment.Moment) => void;
}

interface Step {
  step: number;
  max: number;
  value: number;
  hour?: number;
  minute?: number;
}

const TimePicker = (props: Props) => {
  const {
    format,
    value,
    onChange,
    hourStep = 1,
    minuteStep = 5,
    secondStep = 10,
    disabledHours,
    disabledMinutes,
    disabledSeconds
  } = props;

  const [time, setTime] = useState<moment.Moment | undefined>(moment(value));

  const timeItemProps: (timeType: string) => Step = useCallback(
    (timeType: string) => {
      const hour = moment(value).hour();
      const minute = moment(value).minute();
      const second = moment(value).second();

      switch (true) {
        case SEC.includes(timeType): // 为秒的input框的值
          return {
            step: secondStep,
            max: 60,
            value: second,
            //    disabledTime: disabledSeconds,
            hour,
            minute
          };
        case MINUTE.includes(timeType): // 为分钟的input框的值
          return {
            step: minuteStep,
            max: 60,
            value: minute,
            //    disabledTime: disabledMinutes,
            hour,
            minute
          };
        case HOUR.includes(timeType): // 为小时的input框的值
        default:
          // 默认为  小时
          return {
            step: hourStep,
            max: 24,
            value: hour,
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

  // 时间变化回调
  const timeChange = useCallback(
    (value: number, type: TimeType) => {
      const changeMoment = moment(time).set(type, value);

      // 注释信息
      if (onChange) {
        onChange(changeMoment);
      } else {
        setTime(changeMoment);
      }
    },
    [time, onChange, setTime]
  );

  // 返回分隔符号
  const splitSymbol = useMemo(() => {
    const match = matchTimeFormat(format);
    if (match && Array.isArray(match)) {
      return match[3];
    }
    return "";
  }, [format]);

  // 后缀
  const renderSuffix = useCallback(optionformat => {
    const font = TIMEFORMAT.find(item => item.format.includes(optionformat));

    if (font) {
      return font.des;
    }
    return "-";
  }, []);

  const formatBackTimeType = useCallback((type: string) => {
    if (HOUR.includes(type)) {
      return TimeType.HOUR;
    }
    if (MINUTE.includes(type)) {
      return TimeType.MINUTE;
    }
    if (SEC.includes(type)) {
      return TimeType.SECOND;
    }
    return undefined;
  }, []);

  const timeGroup = useMemo(() => format.split(splitSymbol), [splitSymbol]);

  useEffect(() => {
    setTime(transformMoment(value) || moment());
  }, [value, setTime]);

  return (
    <Warp>
      {timeGroup.map(item => (
        <span key={item}>
          <TimeInput
            format={item}
            timeType={formatBackTimeType(item)}
            onChange={timeChange}
            {...timeItemProps(item)}
          />
          {renderSuffix(item)}
        </span>
      ))}
    </Warp>
  );
};

export default TimePicker;
