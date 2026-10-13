import { useTranslation } from 'react-i18next';
import type { Operation } from '../../homeworks/ts1/3_write';
import { OperationCard } from './OperationCard';
import './operation.css';

export type OperationListProps = Readonly<{
  operations: ReadonlyArray<Operation>;
}>;

export const OperationList = ({ operations }: OperationListProps): JSX.Element => {
  const { t } = useTranslation();

  if (operations.length === 0) {
    return <p className="operation-list__empty">{t('operationList.empty')}</p>;
  }

  return (
    <ul className="operation-list" aria-label={t('operationList.label')}>
      {operations.map((operation) => (
        <li key={operation.id}>
          <OperationCard
            amount={operation.amount}
            category={operation.category.name}
            name={operation.name}
            description={operation.desc ?? ''}
            type={operation.type}
          />
        </li>
      ))}
    </ul>
  );
};
