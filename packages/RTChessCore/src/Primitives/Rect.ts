export default class Rect {
  constructor(
    private _top: number,
    private _right: number,
    private _bottom: number,
    private _left: number
  ) {}

  get top(): number {
    return Math.round(this._top);
  }

  get right(): number {
    return Math.round(this._right);
  }

  get bottom(): number {
    return Math.round(this._bottom);
  }

  get left(): number {
    return Math.round(this._left);
  }

  public getWidth(): number {
    return this.right - this.left + 1;
  }

  public getHeight(): number {
    return this.bottom - this.top + 1;
  }
}
