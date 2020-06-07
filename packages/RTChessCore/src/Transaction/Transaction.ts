import { SerialisedPlayer } from '../Player/Player';

export enum TransactionType {
  INITIALISE = "INITIALISE",
  MOVE = "MOVE",
}

export enum TransactionState {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  REJECTED = "REJECTED",
}

export interface SerialisedTransaction {
  createdAt: number;
  resolvedAt: number | null;
  state: TransactionState;
  type: TransactionType;
  player: SerialisedPlayer;
}

export interface SerialisedMoveTransaction extends SerialisedTransaction {
  createdAt: number;
  piece: string;
  from: string;
  to: string;
}
