import Scene from './Scene';
import WillEnter, { instanceofWillEnter } from '../Scene/WillEnter';
import WillLeave, { instanceofWillLeave } from '../Scene/WillLeave';
import Node from '../Object/Node';
import WillDraw, { instanceofWillDraw } from '../Object/WillDraw';
import Entity from '../Object/Entity';

export enum SceneType {
  SANDBOX,
  COLLISION_TEST,
}

export default class SceneManager {
  private scenePointer: number = 0;

  constructor(private scenes: Scene[]) {}

  private getNextScene(): void {
    const currentScene = this.scenes[this.scenePointer];

    if (instanceofWillLeave(currentScene)) {
      (currentScene as WillLeave).leave();
    }

    if (this.scenes[this.scenePointer + 1] === undefined) {
      throw new Error(`Dead end after ${currentScene.getName()}`);
    }

    this.scenePointer++;

    const nextScene = this.scenes[this.scenePointer];

    if (instanceofWillEnter(nextScene)) {
      (nextScene as WillEnter).enter();
    }
  }

  public getScene(): Scene {
    return this.scenes[this.scenePointer];
  }

  public start(): void {
    const scene = this.scenes[this.scenePointer];

    if (instanceofWillEnter(scene)) {
      (scene as WillEnter).enter();
    }
  }

  public update(): void {
    const scene = this.scenes[this.scenePointer];
    const proceed = scene.update();
    const entities = scene.getChildrenRecursive();

    this.updateEntities(entities);

    if (!proceed) {
      return;
    }

    this.getNextScene();
  }

  public getOnScreenEntities(): Entity[] {
    return this.scenes[this.scenePointer]
      .getChildrenRecursive()
      .filter((tree: Node) => {
        return tree instanceof Entity;
      }) as Entity[];
  }

  private updateEntities(entities: Node[]): void {
    for (const entity of entities) {
      if (entity instanceof Entity) {
        entity.startUpdate();
      }
    }
  }

  public getDrawableEntities(): WillDraw[] {
    // TODO: EXPENSIVE!
    const scene = this.scenes[this.scenePointer];
    const entities = scene.getChildrenRecursive();
    const drawable: WillDraw[] = [];

    for (const entity of entities) {
      if (!instanceofWillDraw(entity)) {
        continue;
      }

      drawable.push(entity as WillDraw);
    }

    return drawable;
  }
}
