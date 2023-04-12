import moment from "moment";

/**
 * 传入 一个 时间 格式的 字符串 或者 时间戳  转换为momnet
 */
const transformMoment = (
  date: string | number | moment.Moment | null | undefined,
  format: string
): moment.Moment | undefined => {
  if (!date) {
    return undefined;
  }

  if (typeof date === "string") {
    const transformDate = moment(Number(date));

    if (transformDate.isValid()) {
      return transformDate;
    }
  }

  const transformDate = moment(date || null);
  if (date && transformDate.isValid()) {
    return moment(transformDate.format(format));
  }

  return undefined;
};

export { transformMoment };
