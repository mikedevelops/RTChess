// TODO: lame type guard
export const instanceofWillEnter = (thing: any): thing is WillEnter => {
  return "enter" in thing;
};

export default interface WillEnter {
  enter(): void;
}
