import IDService from '../Utils/IDService';
import Monolog from '../Logging/Monolog';

export default abstract class Runtime {
  private idService: IDService = new IDService();

  public abstract start(): void;
  public abstract getLogger(): Monolog;
  public getId(): string {
    return this.idService.getId();
  }
}
