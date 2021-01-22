const pattern = {
  dateFormat: /YYYY([A-Za-z_\- \/])MM\1DD/, // 日期部分 正则
  TimeFormat: /(hh|h|HH|H)((:)(mm\3ss|mm))?/ // 时间部分 正则
};

export { pattern };
