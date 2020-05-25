export default class IDService {
  // TODO: Benchmark using an Array and Object here, using a map so we can index on id
  private reserved: Map<string, string> = new Map();

  public getId(): string {
    let id = this.generate();

    while (this.reserved.has(id)) {
      console.warn("ID CLASH!");
      id = this.generate();
    }

    this.reserved.set(id, id);

    return id;
  }

  private generate(): string {
    const utf16Offset = 65;
    const chunkLength = 6;
    const encode = (d: string) => String.fromCharCode(parseInt(d, 10) + utf16Offset);
    const now = Date.now().toString();
    const seed = now.slice(now.length - chunkLength).split("").map(encode).join("");
    const rng = now.slice(now.length - chunkLength).split("").map(d => {
      return (parseInt(d, 10) + Math.floor(Math.random() * 9)).toString();
    }).map(encode).join("");

    return `${seed}_${rng}`;
  }
}
