import { POST, request } from '../Request/Request';
import Log, { LogData, LogLevel } from '../../../RTChessLog/src/Log/Log';

const LOG_ENDPOINT = "http://localhost:3000/log";

export default abstract class Monolog {
  public verbose(message: string, data: LogData = {}): void {
    this.publish(LogLevel.VERBOSE, message, data);
  }

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
    const log = this.createLog(level, message, data);

    // TODO: Decide how to handle these requests failing!
    request(POST, LOG_ENDPOINT, { log: JSON.stringify(log.serialise()) });
  }

  public abstract createLog(level: LogLevel, message: string, data: LogData): Log;
}
