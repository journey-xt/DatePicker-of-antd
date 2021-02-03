const pattern = {
  /** 日期 */
  dateFormat: /YYYY([A-Za-z_\- \/])MM\1DD/, // 日期部分 正则
  /** 时间 */
  TimeFormat: /(HH|hh|kk|H|h|k)((:)((mm|m)(\3(ss|s))?))?/, // 时间部分 正则
  /** 小时 */
  hourFormat: /(HH|hh|kk|H|h|k)/,
  /** 分钟 */
  minuteFormat: /(mm|m)/,
  /** 秒 */
  secondFormat: /(ss|s)/
};

export { pattern };
