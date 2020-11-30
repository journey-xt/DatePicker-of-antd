import React, { PureComponent } from "react";
import styled from "styled-components";
import moment, { Moment } from "moment";
import { memoize } from "lodash";
import TimeInput from "./component/TimeInput";
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
  timePickerOnOpenChange: (status: boolean) => void;
  datePickerOnOpenChange: (status: boolean) => void;
  disabledHours?: () => Array<number>;
  disabledMinutes?: () => Array<number>;
  disabledSeconds?: () => Array<number>;
}

const TimePicker = (props: Props) => {};

export default TimePicker;
