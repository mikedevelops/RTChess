export interface SerialisedLog {
  createdAt: number;
  level: string;
  message: string;
  data: string;
  src: string;
}

export interface DeSerialisedLog {
  createdAt: Date,
  level: LogLevel,
  message: string,
  data: LogData
}

export interface LogData {
  [index: string]: string;
}

export enum LogSrc {
  CLIENT = "CLIENT",
  SERVER = "SERVER",
  LOG = "LOG",
  SIMULATION = "SIMULATION"
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  ERROR = "ERROR",
  EVENT = "EVENT",
}

export interface Log {
  src: LogSrc;
  level: LogLevel;
  message: string;
  createdAt: Date;
  format: () => string;
  data: LogData;
}

// TODO: Logger improvements
// - Track event latency over time
//    e.g. a "lobby update" event is created on the server and assigned an ID,
//    we then log when the client handles that event and the latency between
//    firing and handling! This could then also reduce noise by consolidating
//    logs that are describing a single action across multiple domains

export default class Logger {
  public static instance: Logger;

  private history: Log[] = [];

  constructor() {
    if (Logger.instance !== undefined) {
      throw new Error("Too many instances of the Logger");
    }

    Logger.instance = this;
  }

  public getHistory(): Log[] {
    return this.history.sort((a: Log, b: Log) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  private format(this: Log): string {
    return `${this.createdAt.getTime()} [${this.level}] ${this.message} ${Logger.getDataAsString(this.data)}`;
  }

  private deSerialiseLog(serialisedLog: SerialisedLog): Log {
    let level: LogLevel, src: LogSrc;

    switch (serialisedLog.level) {
      case LogLevel.DEBUG:
        level = LogLevel.DEBUG;
        break;
      case LogLevel.EVENT:
        level = LogLevel.EVENT;
        break;
      case LogLevel.ERROR:
        level = LogLevel.ERROR;
        break;
      case LogLevel.INFO:
        level = LogLevel.INFO;
        break;
      default:
        throw new Error(`Unable to de-serialise log level "${serialisedLog.level}"`);
    }

    switch (serialisedLog.src) {
      case LogSrc.CLIENT:
        src = LogSrc.CLIENT;
        break;
      case LogSrc.SERVER:
        src = LogSrc.SERVER;
        break;
      case LogSrc.LOG:
        src = LogSrc.LOG;
        break;
      case LogSrc.SIMULATION:
        src = LogSrc.SIMULATION;
        break;
      default:
        throw new Error(`Unable to de-serialise log src "${serialisedLog.src}"`);
    }

    let data: LogData;

    try {
      data = JSON.parse(serialisedLog.data);
    } catch(error) {
      throw new Error(`Unable to de-serialise log data "${serialisedLog.data}"`);
    }

    const format: (this: Log) => string = this.format;

    return {
      format: function () {
        return format.call(this);
      },
      src: src,
      level: level,
      data: data,
      createdAt: new Date(serialisedLog.createdAt),
      message: serialisedLog.message
    };
  }

  public hydrate(serialisedLog: SerialisedLog): void {
    const log: Log = this.deSerialiseLog(serialisedLog);

    this.write(log);
  }

  private static getDataAsString(data: LogData): string {
    return Object.keys(data).reduce((result, key) => {
      return result += `${key.toUpperCase()}=${data[key]} `;
    }, "");
  }

  private write(log: Log): void {
    this.history.push(log);
    console.log(log.format());
  }
}
