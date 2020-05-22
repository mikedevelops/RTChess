export default class Time {
  public static delta: number = 0;
  public static waitTimeout: number;

  public static wait(duration: number): Promise<void> {
    clearTimeout(Time.waitTimeout);

    return new Promise((resolve) => {
      Time.waitTimeout = window.setTimeout(resolve, duration);
    });
  }
}
