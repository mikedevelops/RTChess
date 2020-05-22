// TODO: lame type guard
export const instanceofWillLeave = (thing: any): thing is WillLeave => {
  return "leave" in thing;
};

export default interface WillLeave {
  leave(): void;
}
