import Log, { LogLevel, LogSrc, SerialisedLog } from './Log';
import { sortByCreatedAtASC } from '../../../RTChessCore/src/Utils/sort';

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
    return this.history.sort(sortByCreatedAtASC);
  }

  public hydrate(serialisedLog: SerialisedLog): void {
    const log: Log = Logger.deserialiseLog(serialisedLog);

    this.write(log);
  }

  private write(log: Log): void {
    this.history.push(log);
    console.log(log.format());
  }

  public static deserialiseLog(sl: SerialisedLog): Log {
    return new Log(
      LogSrc[sl.src as LogSrc],
      LogLevel[sl.level as LogLevel],
      sl.message,
      sl.timestamp,
      JSON.parse(sl.data),
      new Date(sl.createdAt)
    );
  }
}
