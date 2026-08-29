export type OperationType = 'Cost' | 'Profit';

export type OperationViewProps = {
  amount: number;
  category: string;
  name: string;
  description: string;
  type?: OperationType;
};

export type OperationDetailsProps = OperationViewProps & {
  date: string;
};
