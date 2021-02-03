const HOUR = ["HH", "H", "hh", "h", "kk", "k"];

const MINUTE = ["mm", "m"];

const SEC = ["ss", "s"];

// 非公务员上班时间段
const SENIORPERSON = [0, 1, 2, 3, 4, 5, 6, 7, 23];

const TIMEFORMAT = [
  { format: HOUR, des: "时" },
  { format: MINUTE, des: "分" },
  { format: SEC, des: "秒" }
];

export { HOUR, MINUTE, SEC, SENIORPERSON, TIMEFORMAT };
