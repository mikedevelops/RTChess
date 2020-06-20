import { padNumber } from '../Math/Math';

export default class Time {
  constructor(private date: Date) {}

  public static from(date: Date): Time {
    return new Time(date);
  }

  public formatShort(): string {
    const hours = padNumber(this.date.getHours());
    const minutes = padNumber(this.date.getMinutes());
    const seconds = padNumber(this.date.getSeconds());
    const ms = padNumber(this.date.getMilliseconds(), 100);

    return this.date.getTime().toString();
  }

  public getTime(): number {
    return this.date.getTime();
  }

  public getDelta(time: Time): number {
   return time.getTime() - this.date.getTime();
  }
}
