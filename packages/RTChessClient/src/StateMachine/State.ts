export default abstract class State {
  public abstract getName(): string;
  public abstract update(): State | null;
}
