export default class MathUtils {
  public static clamp(n: number, min = 0, max = Infinity): number {
    if (n < min) {
      return min;
    }

    if (n > max) {
      return max;
    }

    return n;
  }
}
