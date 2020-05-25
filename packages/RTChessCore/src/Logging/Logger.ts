export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  ERROR = "ERROR",
  EVENT = "EVENT",
}

export interface LogData {
  [index: string]: string;
}

export interface Log {
  level: LogLevel;
  message: string;
  createdAt: Date;
  format: () => string;
  data: LogData;
}

export default class Logger {
  private history: Log[] = [];

  public getHistory(): Log[] {
    return this.history;
  }

  public info (message: string, data: LogData = {}): void {
    const format = this.format;
    const log = {
      message,
      data,
      createdAt: new Date(),
      level: LogLevel.INFO,
      format: function (): string {
        return format.call(this);
      }
    }

    this.write(log);
  }

  public error(message: string, data: LogData = {}): void {
    const format = this.format;
    const log = {
      message,
      data,
      createdAt: new Date(),
      level: LogLevel.ERROR,
      format: function () {
        return format.call(this);
      }
    };

    this.write(log);
  }

  public event(message: string, data: LogData = {}): void {
    const format = this.format;
    const log = {
      message,
      data,
      createdAt: new Date(),
      level: LogLevel.EVENT,
      format: function () {
        return format.call(this);
      }
    };

    this.write(log);
  }

  private static getDataAsString(data: LogData): string {
    return Object.keys(data).reduce((result, key) => {
      return result += `${key.toUpperCase()}=${data[key]} `;
    }, "");
  }

  private format(this: Log): string {
    return `${this.createdAt.getTime()} [${this.level}] ${this.message} ${Logger.getDataAsString(this.data)}`;
  }

  private write(log: Log): void {
    this.history.push(log);
    console.log(log.format());
  }
}
