export const computeTag: (
  max: number,
  step: number
) => Array<{ value: number; disabled: boolean }> = (max, step) => {
  const array: Array<{ value: number; disabled: boolean }> = [];
  let i = 0;
  while (i < max) {
    /* eslint-disable no-loop-func */
    array.push({ value: i, disabled: false });
    /* eslint-enable no-loop-func */
    i += step;
  }
  return array;
};
