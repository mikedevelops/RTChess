import Monolog from '../../../RTChessCore/src/Logging/Monolog';
import Log, { LogData, LogLevel, LogSrc } from '../../../RTChessLog/src/Log/Log';

// TODO: implement Log factory for creating logs in node and js
export default class MonologClient extends Monolog {
  public createLog(
    level: LogLevel,
    message: string,
    data: LogData
  ): Log {
    return new Log(
      LogSrc.CLIENT,
      level,
      message,
      performance.now(),
      data,
      new Date(),
    );
  }
}
