import { LogData, LogLevel, LogSrc, SerialisedLog } from '../../../RTChessLog/src/Log/Logger';
import { request } from "../Request/Request";

const LOG_ENDPOINT = "http://localhost:3000/log";

export default class Monolog {
  constructor(private src: LogSrc) {}

  public info(message: string, data: LogData = {}): void {
    this.publish(LogLevel.INFO, message, data);
  }

  public error(message: string, data: LogData = {}): void {
    this.publish(LogLevel.ERROR, message, data);
  }

  public event(message: string, data: LogData = {}): void {
    this.publish(LogLevel.EVENT, message, data);
  }

  private publish(level: LogLevel, message: string, data: LogData = {}): void {
    const serialised: SerialisedLog = {
      src: this.src,
      level: level,
      createdAt: Date.now(),
      message,
      data: JSON.stringify(data),
    };

    // TODO: Decide how to handle these requests failing!
    request(LOG_ENDPOINT, { log: JSON.stringify(serialised) });
  }
}
