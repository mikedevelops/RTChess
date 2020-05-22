import Scene from "./Scene";

export const S_STARTUP = "S_STARTUP";

export default class StartupScene extends Scene {
  public getName(): string {
    return S_STARTUP;
  }

  public update(): boolean {
    return false;
  }

  public enter(): void {}

  public leave(): void {}
}
