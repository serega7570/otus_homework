import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import type { OperationViewProps } from './operationTypes';
import { formatCurrency } from '../../shared/lib/formatters';
import './operation.css';

export const OperationCard = memo(function OperationCard({
  amount,
  category,
  name,
  description,
  type = 'Cost',
}: OperationViewProps): JSX.Element {
  const { i18n } = useTranslation();
  return (
    <article className="operation-card">
      <div className={`operation-card__icon operation-card__icon--${type.toLowerCase()}`} aria-hidden="true">
        {type === 'Cost' ? '↗' : '↙'}
      </div>
      <div className="operation-card__body">
        <span className="operation-card__category">{category}</span>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <strong className={`operation-card__amount operation-card__amount--${type.toLowerCase()}`}>
        {type === 'Cost' ? '−' : '+'}
        {formatCurrency(amount, 2, i18n.language)}
      </strong>
    </article>
  );
});
