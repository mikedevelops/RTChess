const BASE_UNIT = 32;

export default class Unit {
  public static getUnit(n: number = 1): number {
    return n * BASE_UNIT;
  }
}
