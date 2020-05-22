import Unit from "./Unit";
import Rect from "../Primitives/Rect";

interface Coord {
  x: number;
  y: number;
}

export default class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  public static from(coord: Coord): Vector2 {
    return new Vector2(coord.x, coord.y);
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static north(): Vector2 {
    return new Vector2(0, 1);
  }

  public static east(): Vector2 {
    return new Vector2(1, 0);
  }

  public static south(): Vector2 {
    return new Vector2(0, -1);
  }

  public static west(): Vector2 {
    return new Vector2(-1, 0);
  }

  public static unit(
    x: number,
    y: number,
    unit: number = Unit.getUnit(1)
  ): Vector2 {
    return new Vector2(x, y).multiply(unit);
  }

  public isInside(rect: Rect): boolean {
    if (this.x < rect.left) {
      return false;
    }

    if (this.x > rect.right) {
      return false;
    }

    if (this.y < rect.top) {
      return false;
    }

    if (this.y > rect.bottom) {
      return false;
    }

    return true;
  }

  public abs(x: boolean = true, y: boolean = true): Vector2 {
    if (x) {
      this.x = Math.abs(this.x);
    }

    if (y) {
      this.y = Math.abs(this.y);
    }

    return this;
  }

  public invert(x: boolean = true, y: boolean = true): Vector2 {
    if (x) {
      this.x *= -1;
    }

    if (y) {
      this.y *= -1;
    }

    return this;
  }

  public set(position: Vector2): Vector2 {
    this.x = position.x;
    this.y = position.y;

    return this;
  }

  public toString(): string {
    return `[${this.x},${this.y}]`;
  }

  public equals(vector: Vector2): boolean {
    return vector.x === this.x && vector.y === this.y;
  }

  public add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  public addX(x: number): Vector2 {
    this.x += x;

    return this;
  }

  public minusX(x: number): Vector2 {
    this.x -= x;

    return this;
  }

  public minusY(y: number): Vector2 {
    this.y -= y;

    return this;
  }

  public addY(y: number): Vector2 {
    this.y += y;

    return this;
  }

  public multiply(factorX: number, factorY: number = factorX): Vector2 {
    this.x *= factorX;
    this.y *= factorY;

    return this;
  }

  public minus(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
