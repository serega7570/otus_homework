import type { OperationDetailsProps } from './operationTypes';
import { formatCurrency, formatDate } from '../../shared/lib/formatters';
import './operation.css';

export const OperationDetails = ({
  amount,
  category,
  name,
  description,
  date,
  type = 'Cost',
}: OperationDetailsProps): JSX.Element => (
  <article className="operation-details">
    <div className="operation-details__topline">
      <span className="operation-details__category">{category}</span>
      <time dateTime={date}>{formatDate(date)}</time>
    </div>
    <h2>{name}</h2>
    <p>{description}</p>
    <div className="operation-details__footer">
      <strong className={`operation-details__amount operation-details__amount--${type.toLowerCase()}`}>
        {type === 'Cost' ? '−' : '+'}
        {formatCurrency(amount)}
      </strong>
      <button type="button">Редактировать</button>
    </div>
  </article>
);
