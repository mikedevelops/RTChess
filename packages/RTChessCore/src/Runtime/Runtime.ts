import Logger from '../Logging/Logger';
import IDService from '../Utils/IDService';

export default abstract class Runtime {
  private idService: IDService = new IDService();

  public abstract start(): void;
  public abstract getLogger(): Logger;
  public getId(): string {
    return this.idService.getId();
  }
}
