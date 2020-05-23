import SerialisedPlayer from '../Player/SerialisedPlayer';

export enum TransactionType {
  INITIALISE,
  MOVE,
}

export enum TransactionState {
  PENDING,
  COMPLETE,
  REJECTED,
}

export interface SerialisedTransaction {
  createdAt: number;
  resolvedAt: number | null;
  state: TransactionState;
  type: TransactionType;
  player: SerialisedPlayer;
}

export const transactionType = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.INITIALISE:
      return "INITIALISE";
    case TransactionType.MOVE:
      return "MOVE";
  }
};

export const transactionState = (state: TransactionState): string => {
  switch (state) {
    case TransactionState.COMPLETE:
      return "COMPLETE";
    case TransactionState.PENDING:
      return "PENDING";
    case TransactionState.REJECTED:
      return "REJECTED";
  }
};
