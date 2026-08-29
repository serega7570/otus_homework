export type OperationType = 'Cost' | 'Profit';

export type OperationViewProps = Readonly<{
  amount: number;
  category: string;
  name: string;
  description: string;
  type?: OperationType;
}>;

export type OperationDetailsProps = OperationViewProps & Readonly<{
  date: string;
}>;
