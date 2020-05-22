import "regenerator-runtime/runtime";

import Renderer from "./Renderer/Renderer";
import Runtime, { RuntimeMode, RuntimeFlag } from "./Runtime/Runtime";
import InputDelegator from "./Input/InputDelegator";
import Debugger, { DebugFlag } from "./Debugger/Debugger";
import SceneManager from "./Scene/SceneManager";
import SandboxScene from "./Scene/SandboxScene";
import DebugInputManager from "./Input/DebugInputManager";
import MoveResolver from "./Runtime/MoveResolver";

const root = document.getElementById("stage");
const dpr = window.devicePixelRatio || 1;

if (!(root instanceof HTMLCanvasElement)) {
  throw new Error("Stage is not a HTMLCanvasElement");
}

const rect = root.getBoundingClientRect();

root.width = rect.width * dpr;
root.height = rect.height * dpr;

const input = new InputDelegator();
const renderer = new Renderer(root, dpr);
const moveResolver = new MoveResolver();
const sceneManager = new SceneManager([new SandboxScene()]);
const debug = new Debugger([
  DebugFlag.FRAMES,
  //DebugFlag.ENTITY_TREE,
  DebugFlag.TRANSACTIONS,
  //DebugFlag.EVENTS,
]);
const runtime = new Runtime(
  renderer,
  input,
  sceneManager,
  debug,
  moveResolver,
  RuntimeMode.DEBUG,
  [RuntimeFlag.SINGLE_PLAYER]
);

if (!runtime.isProduction()) {
  input.register(new DebugInputManager());
}

// TODO: Some sort of loading state here perhaps?
// TODO: Read into detecting when the font is loaded...

/**
 * Short delay before starting to runtime to ensure
 * fonts have been loaded
 */
window.setTimeout(() => {
  runtime.start();
}, 25);
