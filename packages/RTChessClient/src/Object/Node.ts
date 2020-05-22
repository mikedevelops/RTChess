export default abstract class Node {
  protected children: Node[] = [];

  public addChild(child: Node): void {
    this.children.push(child);
  }

  private walkTree(cb: ((child: Node) => void) | null = null): Node[] {
    const walk = (node: Node, children: Node[] = []): Node[] => {
      return node.children.reduce((children, child) => {
        // TS will check our arg is a function here...
        if (cb !== null) {
          cb(child);
        }

        return walk(child, children.concat(child));
      }, children);
    };

    return walk(this);
  }

  public forEachChildRecursive(cb: (child: Node) => void): void {
    this.walkTree(cb);
  }

  public getChildrenRecursive(): Node[] {
    return this.walkTree();
  }

  public removeChild(target: Node): void {
    this.children = this.children.reduce((children: Node[], child: Node) => {
      if (child === target) {
        return children;
      }

      children.push(child);

      return children;
    }, []);
  }
}
