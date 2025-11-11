import { TransactionTypes } from 'src/enums/transaction-types.enum';

export class Transaction {
  constructor(intialData: Partial<Transaction>) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }
  id: string;
  sender: string | undefined;
  recipient: string;
  price: number;
  transactionType: TransactionTypes;
  songTitle: string;
  expiration: string;
}
