import State from "./State";

export interface ExitState extends State {
  leave(): void;
}

export const instanceOfExitState = (state: State): state is ExitState => {
  return "leave" in state;
};
