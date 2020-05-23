import { SerialisedTransaction } from './SerialisedTransaction';

export interface SerialisedMoveTransaction extends SerialisedTransaction {
  createdAt: number;
  piece: string;
  from: string;
  to: string;
}
