export default class Rect {
  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number
  ) {}

  public getWidth(): number {
    return this.right - this.left + 1;
  }

  public getHeight(): number {
    return this.bottom - this.top + 1;
  }
}
