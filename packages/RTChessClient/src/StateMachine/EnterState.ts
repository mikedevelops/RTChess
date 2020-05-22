import State from "./State";

export interface EnterState extends State {
  enter(): void;
}

export const instanceOfEnterState = (state: State): state is EnterState => {
  return "enter" in state;
};
