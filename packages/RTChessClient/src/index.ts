import "regenerator-runtime/runtime";

import ClientRuntime, { RuntimeMode, RuntimeFlag } from "./Runtime/ClientRuntime";
import InputDelegator from "./Input/InputDelegator";
import Debugger, { DebugFlag } from "./Debugger/Debugger";
import DebugInputManager from "./Input/DebugInputManager";

const root = document.getElementById("stage");
const dpr = window.devicePixelRatio || 1;

if (!(root instanceof HTMLCanvasElement)) {
  throw new Error("Stage is not a HTMLCanvasElement");
}

const rect = root.getBoundingClientRect();

root.width = rect.width * dpr;
root.height = rect.height * dpr;

const input = new InputDelegator();
const debug = new Debugger([
  DebugFlag.FRAMES,
  DebugFlag.TRANSACTIONS,
  DebugFlag.ENTITIES,
  DebugFlag.NETWORK,
]);
const runtime = new ClientRuntime(
  root,
  dpr,
  debug,
  RuntimeMode.DEBUG,
  [RuntimeFlag.MULTI_PLAYER]
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
setTimeout(() => {
  if (runtime.hasFlag(RuntimeFlag.MULTI_PLAYER)) {
    runtime.connect();
    return;
  }

  if (runtime.hasFlag(RuntimeFlag.SINGLE_PLAYER)) {
    runtime.start();
  }
}, 25);

