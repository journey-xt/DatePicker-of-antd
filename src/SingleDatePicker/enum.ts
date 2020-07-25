export enum ValueType {
  TimeStamp = "timeStamp", // 时间戳
  TimeString = "timeString", // 字符串时间
  Moment = "moment", // moment对象
}

export enum ValueStatus {
  Start = "start", // 开始时间
  End = "end", // 结束时间
}

/**
 * 选择模式
 */
export enum SelectMode {
  /**
   * 选择今天之前 包含今天
   */
  BEFORETODAY = "before_today",

  /**
   * 选择今天之前 不包含今天
   */
  BEFORECURRENT = "before_current",

  /**
   * 选择今天之后 包含今天
   */
  AFTERTODAY = "after_today",

  /**
   * 选择今天之后 不包含今天
   */
  AFTERCURRENT = "after_current",
}
