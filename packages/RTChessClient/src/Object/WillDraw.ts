import { SortLayer } from "../Renderer/Renderer";

// TODO: implement a better type guard if possible
export const instanceofWillDraw = (thing: any): thing is WillDraw => {
  return "draw" in thing;
};

export default interface WillDraw {
  draw(): void;
  getSortLayer(): SortLayer;
}
