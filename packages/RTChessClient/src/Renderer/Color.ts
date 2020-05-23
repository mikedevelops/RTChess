export default class Color {
  public static RED: Color = new Color(255, 0, 0);
  public static WHITE: Color = new Color(255, 255, 255);
  public static BLACK: Color = new Color(0, 0, 0);
  public static GREEN: Color = new Color(0, 255, 0);
  public static DEBUG: Color = new Color(0, 255, 255);
  public static YELLOW: Color = new Color(255, 255, 0);
  public static BLUE: Color = new Color(0, 0, 255);
  public static ORANGE: Color = new Color(254, 110, 0);

  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public alpha: number = 1
  ) {}

  public setAlpha(alpha: number): Color {
    return new Color(this.red, this.green, this.blue, alpha);
  }

  public toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }
}
