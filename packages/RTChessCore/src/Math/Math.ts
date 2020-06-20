export const clamp = (n: number, min = 0, max = Infinity): number => {
  if (n < min) {
    return min;
  }

  if (n > max) {
    return max;
  }

  return n;
}

export const padNumber = (n: number, len: number = 10): string => {
  const numLen = n.toString().length;
  const padLen = len.toString().length;
  let pad = "";

  for (let i = 0; i < padLen - numLen; i++) {
    pad += "0";
  }

  return n < len ? pad + n : n.toString();
};
