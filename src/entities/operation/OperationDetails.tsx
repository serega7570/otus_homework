import type { OperationDetailsProps } from './operationTypes';
import './operation.css';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
const readableDate = (value: string): string =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(value));

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
      <time dateTime={date}>{readableDate(date)}</time>
    </div>
    <h2>{name}</h2>
    <p>{description}</p>
    <div className="operation-details__footer">
      <strong className={`operation-details__amount operation-details__amount--${type.toLowerCase()}`}>
        {type === 'Cost' ? '−' : '+'}
        {money.format(amount)}
      </strong>
      <button type="button">Редактировать</button>
    </div>
  </article>
);
