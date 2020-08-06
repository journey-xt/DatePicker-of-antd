export enum ValueType {
  TimeStamp = "timeStamp", // 时间戳
  TimeString = "timeString", // 字符串时间
  Moment = "moment", // moment对象
}

export enum ValueStatus {
  Start = "start", // 开始时间
  End = "end", // 结束时间
}

// 选择模式
export enum SelectMode {
  /**
   * 今天 及 以后
   */
  TODYANDAFTER = "todyAndAfter",

  /**
   * 以后
   */
  AFTER = "after",

  /**
   * 以前 及 今天
   */
  BREFOREANDTODAY = "breforeAndToday",

  /**
   * 以前
   */
  BREFORE = "brefore",
}
