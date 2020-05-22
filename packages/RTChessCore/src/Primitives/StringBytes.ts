export default class StringBytes {
  public static toUTF8String(data: object): string {
    const bytes = Object.values(data);
    let str = "";

    for (let b = 0; b < bytes.length; b++) {
      str += String.fromCharCode(bytes[b]);
    }

    return str;
  }

  public static toBytes(string: String): Uint8Array {
    const bytes = new Uint8Array();

    for (let c = 0; c < string.length; c++) {
      bytes.fill(string[c].charCodeAt(0), c);
    }

    return bytes;
  }
}
