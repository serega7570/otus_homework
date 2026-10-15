import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AccountService } from '../../entities/account/AccountService';
import { InMemoryDiscountRepository } from '../../entities/account/InMemoryDiscountRepository';
import type { UserType } from '../../entities/account/types';
import { DiscountManager } from './DiscountManager';

const ConfiguredDemo = (): JSX.Element => {
  const [service] = useState(() => new AccountService(new InMemoryDiscountRepository()));
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    let active = true;
    void Promise.all([
      service.setUserDiscount('Gold', 10), service.setProductDiscount('Gold', 'Car', 5),
      service.setUserDiscount('Premium', 7), service.setProductDiscount('Standard', 'Food', 2),
    ]).then(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [service]);
  return ready ? <DiscountManager service={service} /> : <p role="status">{t('discounts.loading')}</p>;
};

class UnavailableRepository extends InMemoryDiscountRepository {
  override async readUserDiscount(_userType: UserType): Promise<number | undefined> {
    throw new Error('Demo storage is unavailable');
  }
}
const UnavailableDemo = (): JSX.Element => {
  const [service] = useState(() => new AccountService(new UnavailableRepository()));
  return <DiscountManager service={service} />;
};

const meta = {
  title: 'Сервисы/AccountService', component: DiscountManager, tags: ['autodocs'],
  argTypes: { service: { control: false } },
  parameters: { docs: { description: { component: 'AccountService через TDD. Скидки задаются для Standard, Premium, Gold и Free; товары — Car, Toy и Food. Общая и товарная скидки суммируются. Хранилище передаётся в сервис через DiscountRepository; примеры используют независимые базы в памяти.' } } },
} satisfies Meta<typeof DiscountManager>;
export default meta;
type Story = StoryObj<typeof meta>;
export const EmptyPolicies: Story = {};
export const ConfiguredPolicies: Story = { render: () => <ConfiguredDemo /> };
export const StorageUnavailable: Story = { render: () => <UnavailableDemo /> };
