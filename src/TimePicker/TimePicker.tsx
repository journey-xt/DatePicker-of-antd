import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  disabledTime?: (currentData?: Moment, timeType?: TimeType) => boolean;
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
    disabledTime
  } = props;

  const [time, setTime] = useState<moment.Moment | undefined>(
    transformMoment(value, `YYYY-MM-DD ${format}`)
  );

  const timeRef = useRef(time);
  timeRef.current = time;

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
            disabledTime,
            hour,
            minute
          };
        case MINUTE.includes(timeType): // 为分钟的input框的值
          return {
            step: minuteStep,
            max: 60,
            value: minute,
            disabledTime,
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
            disabledTime,
            hour,
            minute
          };
      }
    },
    [format, value, hourStep, minuteStep, secondStep, disabledTime]
  );

  // 时间变化回调：基准从 ref 实时读取，避免 Popover 旧闭包覆盖上一次选择
  const timeChange = useCallback(
    (value: number, type?: TimeType) => {
      if (!type) {
        return;
      }
      const changeMoment = moment(timeRef.current).set(type, value);
      setTime(changeMoment);
      if (onChange) {
        onChange(changeMoment);
      }
    },
    [onChange, setTime]
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

  const timeGroup = useMemo(() => {
    const match = matchTimeFormat(format);
    const timePart = match && Array.isArray(match) && match[0];
    return (timePart || format).split(splitSymbol);
  }, [format, splitSymbol]);

  useEffect(() => {
    setTime(transformMoment(value, `YYYY-MM-DD ${format}`));
  }, [value, setTime, format]);

  return (
    <Warp>
      {timeGroup.map(item => (
        <span key={item}>
          <TimeInput
            format={item}
            time={time}
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
