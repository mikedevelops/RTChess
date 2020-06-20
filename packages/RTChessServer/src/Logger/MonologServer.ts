import Monolog from '../../../RTChessCore/src/Logging/Monolog';
import Log, { LogData, LogLevel, LogSrc } from '../../../RTChessLog/src/Log/Log';
import { performance } from 'perf_hooks';

export default class MonologServer extends Monolog {
  createLog(level: LogLevel, message: string, data: LogData): Log {
    return new Log(
      LogSrc.SERVER,
      level,
      message,
      performance.now(),
      data,
    );
  }
}
