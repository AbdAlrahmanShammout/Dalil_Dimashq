export type TransactionContext = object;

export abstract class TransactionRunner {
  abstract run<T>(work: (context: TransactionContext) => Promise<T>): Promise<T>;
}
