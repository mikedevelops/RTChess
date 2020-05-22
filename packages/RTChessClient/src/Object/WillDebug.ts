export const instanceofWillDebug = (thing: any): thing is WillDebug => {
  return "debug" in thing;
};

export default interface WillDebug {
  debug(): void;
}
