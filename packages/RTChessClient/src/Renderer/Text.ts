import Unit from "../Math/Unit";
import Runtime from "../Runtime/Runtime";

export default class Text {
  public static FONT_SIZE = Unit.getUnit(0.75);
  public static FONT_TRACKING = Text.FONT_SIZE / 1.85;
  public static LINE_HEIGHT = Text.FONT_SIZE;

  private static FONT_FAMILY = "dos";

  public static createSize(size: number): string {
    return size.toString() + "px";
  }

  public static getFont(
    size: number = Text.FONT_SIZE,
    font: string = Text.FONT_FAMILY
  ): string {
    return Text.createSize(size) + " " + font;
  }

  public static getWidth(text = "", font = Text.getFont()): number {
    if (text === "") {
      /**
       * We are creating a monospace font here essentially. Each character
       * will be drawn at the same offset
       */
      return Text.FONT_TRACKING;
    }

    const ctx = Runtime.instance.getRenderingContext();

    ctx.save();
    ctx.font = font;

    const { width } = ctx.measureText(text);

    ctx.restore();

    return width;
  }
}
