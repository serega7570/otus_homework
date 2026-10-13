import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountService } from '../../entities/account/AccountService';
import { InMemoryDiscountRepository } from '../../entities/account/InMemoryDiscountRepository';
import { productTypes, userTypes, type AccountServiceContract, type ProductType, type UserType } from '../../entities/account/types';
import { FormField } from '../forms/FormField';
import '../../shared/ui/components.css';
import './discounts.css';

export type DiscountManagerProps = Readonly<{ service?: AccountServiceContract }>;
type Policy = Readonly<{ general: number; product: number; total: number }>;
type ErrorState = Readonly<{ key: string; field?: 'general' | 'product' }>;

export const DiscountManager = ({ service }: DiscountManagerProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [localService] = useState(() => new AccountService(new InMemoryDiscountRepository()));
  const accountService = service ?? localService;
  const [userType, setUserType] = useState<UserType>('Standard');
  const [productType, setProductType] = useState<ProductType>('Car');
  const [general, setGeneral] = useState('0');
  const [product, setProduct] = useState('0');
  const [policy, setPolicy] = useState<Policy>();
  const [error, setError] = useState<ErrorState>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const busy = loading || saving;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPolicy(undefined);
    setError(undefined);
    void Promise.all([
      accountService.getUserDiscount(userType), accountService.getProductDiscount(userType, productType),
      accountService.calculateDiscount(userType, productType),
    ]).then(([savedGeneral, savedProduct, total]) => {
      if (!active) return;
      setGeneral(String(savedGeneral));
      setProduct(String(savedProduct));
      setPolicy({ general: savedGeneral, product: savedProduct, total });
    }).catch(() => {
      if (active) setError({ key: 'discounts.loadError' });
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [accountService, userType, productType, revision]);

  const save = async (event: FormEvent<HTMLFormElement>, field: 'general' | 'product'): Promise<void> => {
    event.preventDefault();
    if (busy || !policy) return;
    setError(undefined);
    setSaving(true);
    try {
      const value = field === 'general' ? general : product;
      if (!value.trim()) throw new RangeError('Empty discount');
      if (field === 'general') await accountService.setUserDiscount(userType, Number(value));
      else await accountService.setProductDiscount(userType, productType, Number(value));
      setRevision((value) => value + 1);
    } catch (failure) {
      setError(failure instanceof RangeError ? { key: 'discounts.invalid', field } : { key: 'discounts.saveError' });
    } finally {
      setSaving(false);
    }
  };

  const number = (value: number): string => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 10 }).format(value);
  const clearError = (): void => setError(undefined);
  return (
    <div className="discount-manager" aria-busy={busy}>
      <div className="homework-form__row">
        <FormField name="userType" label={t('discounts.userType')} value={userType} disabled={busy} onBlur={() => undefined} onChange={(event) => setUserType(event.target.value as UserType)} options={userTypes.map((value) => ({ value, label: value }))} />
        <FormField name="productType" label={t('discounts.productType')} value={productType} disabled={busy} onBlur={() => undefined} onChange={(event) => setProductType(event.target.value as ProductType)} options={productTypes.map((value) => ({ value, label: t(`discounts.products.${value}`) }))} />
      </div>
      <div className="discount-manager__forms">
        <form className="homework-form" noValidate onSubmit={(event) => { void save(event, 'general'); }} aria-label={t('discounts.generalForm')}>
          <FormField name="generalDiscount" label={t('discounts.general')} value={general} type="number" min="0" max="100" step="any" inputMode="decimal" disabled={busy || !policy} onBlur={() => undefined} onChange={(event) => { setGeneral(event.target.value); clearError(); }} hint={t('discounts.generalHint', { userType })} error={error?.field === 'general' ? error.key : undefined} />
          <button className="ui-button" type="submit" disabled={busy || !policy}>{t('discounts.saveGeneral')}</button>
        </form>
        <form className="homework-form" noValidate onSubmit={(event) => { void save(event, 'product'); }} aria-label={t('discounts.productForm')}>
          <FormField name="productDiscount" label={t('discounts.product')} value={product} type="number" min="0" max="100" step="any" inputMode="decimal" disabled={busy || !policy} onBlur={() => undefined} onChange={(event) => { setProduct(event.target.value); clearError(); }} hint={t('discounts.productHint', { userType, productType: t(`discounts.products.${productType}`) })} error={error?.field === 'product' ? error.key : undefined} />
          <button className="ui-button" type="submit" disabled={busy || !policy}>{t('discounts.saveProduct')}</button>
        </form>
      </div>
      {busy && <p role="status">{t('discounts.loading')}</p>}
      {error && !error.field && <p className="form-field__error" role="alert">{t(error.key)}</p>}
      {!busy && !policy && <button className="ui-button" type="button" onClick={() => setRevision((value) => value + 1)}>{t('discounts.retry')}</button>}
      {!busy && policy && (
        <div className="discount-manager__result">
          <p>{t('discounts.savedPolicy')}</p>
          <div className="discount-manager__formula">
            <span>{number(policy.general)}% + {number(policy.product)}% = </span>
            <output aria-label={t('discounts.total')}>{number(policy.total)}%</output>
          </div>
        </div>
      )}
    </div>
  );
};
