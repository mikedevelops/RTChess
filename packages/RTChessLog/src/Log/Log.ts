export enum LogSrc {
  CLIENT = 'CLIENT',
  SERVER = 'SERVER',
  LOG = 'LOG',
  SIMULATION = 'SIMULATION'
}

export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  EVENT = 'EVENT',
  VERBOSE = 'VERBOSE',
}

export interface LogData {
  [index: string]: string;
}

export interface SerialisedLog {
  createdAt: number;
  level: string;
  message: string;
  data: string;
  src: string;
  timestamp: number;
}

export default class Log {
  constructor(
    private src: LogSrc,
    private level: LogLevel,
    private message: string,
    private timestamp: number,
    private data: LogData = {},
    private createdAt: Date = new Date(),
  ) {}

  public getTimestamp(): number {
    return this.timestamp;
  }

  public getCreatedAt(): Date  {
    return this.createdAt;
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  public getSrc(): LogSrc {
    return this.src;
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): LogData {
    return this.data;
  }

  public format(): string {
    return `${this.createdAt.getTime()} [${this.level}] ${this.message}`;
  }

  public serialise(): SerialisedLog {
    return {
      src: this.src as string,
      level: this.level as string,
      createdAt: this.createdAt.getTime(),
      timestamp: this.timestamp,
      data: JSON.stringify(this.data),
      message: this.message,
    };
  }
}
