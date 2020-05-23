import { PlayerState } from './PlayerCore';

export default interface SerialisedPlayer {
  id: string;
  state: PlayerState;
}
