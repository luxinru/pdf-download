export function isNum(value) {
  return !Number.isNaN(Number(value));
}

export function wrapNumber(value) {
  if (isNum(value)) {
    return +value;
  }
  return value;
}
