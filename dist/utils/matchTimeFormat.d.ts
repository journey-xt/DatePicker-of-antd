/// <reference types="lodash" />
declare const matchTimeFormat: ((regexp: string) => RegExpMatchArray | null) & import("lodash").MemoizedFunction;
export { matchTimeFormat };
