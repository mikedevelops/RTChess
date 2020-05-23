import SerialisedPlayer from '../Player/SerialisedPlayer';

export interface SerialisedMatch {
  id: string;
  playerOne: SerialisedPlayer;
  playerTwo: SerialisedPlayer;
}
