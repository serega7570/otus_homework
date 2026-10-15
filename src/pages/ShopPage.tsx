import { useCallback, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../app/store/hooks';
import { useProductsInfiniteQuery, useCreateOrderMutation, useOrdersInfiniteQuery } from '../shared/api/serverApi';
import type { Product } from '../shared/api/types';
import { ApiError } from '../features/server/Feedback';
import { ProductEditor } from '../features/server/ProductEditor';
import { Pagination, uniqueItems } from '../features/server/Pagination';
import { FormField } from '../features/forms/FormField';
import { Modal } from '../shared/ui';

export const ShopPage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const { token, profile } = useAppSelector((state) => state.auth);
  const productsQuery = useProductsInfiniteQuery(token!);
  const ordersQuery = useOrdersInfiniteQuery({ token: token!, userId: profile!.id });
  const products = uniqueItems(productsQuery.currentData?.pages);
  const orders = uniqueItems(ordersQuery.currentData?.pages);
  const [editor, setEditor] = useState<Product | 'new' | null>(null);
  const [cart, setCart] = useState<Record<string, { product: Product; quantity: string }>>({});
  const [orderId, setOrderId] = useState<string>();
  const [quantityError, setQuantityError] = useState(false);
  const [createOrder, order] = useCreateOrderMutation();
  const loadMore = useCallback(() => { if (productsQuery.hasNextPage && !productsQuery.isFetching) void productsQuery.fetchNextPage(); }, [productsQuery.hasNextPage, productsQuery.isFetching, productsQuery.fetchNextPage]);
  const entries = Object.values(cart).map((entry) => ({ ...entry, product: products.find((item) => item.id === entry.product.id) ?? entry.product }));
  const money = (amount: number) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'RUB' }).format(amount);
  const resetOrderMessage = () => { order.reset(); setOrderId(undefined); setQuantityError(false); };
  const checkout = async (event: FormEvent) => {
    event.preventDefault();
    if (!entries.length || order.isLoading) return;
    if (entries.some(({ quantity }) => !/^\d+$/.test(quantity) || Number(quantity) < 1 || Number(quantity) > 999)) { setQuantityError(true); return; }
    setQuantityError(false);
    try {
      const result = await createOrder({ products: entries.map(({ product, quantity }) => ({ id: product.id, quantity: Number(quantity) })), status: 'pending_confirmation' }).unwrap();
      setOrderId(result.id);
      setCart({});
    } catch { /* RTK Query exposes the server error below; preserve the cart. */ }
  };
  return <section className="screen-panel" aria-labelledby="shop-title">
    <div className="screen-panel__heading"><h1 id="shop-title">{t('server.shop.title')}</h1>
      <button className="ui-button" type="button" onClick={() => setEditor('new')}>{t('server.shop.create')}</button>
    </div>
    <p>{t('server.shop.description')}</p>
    <div className="server-shop">
      <div>
        <div className="server-shop__grid">
          {products.map((product) => <article key={product.id} className="server-shop__card" aria-label={product.name}>
            <h2>{product.name}</h2><p>{product.category?.name}</p><p>{product.desc}</p><strong>{money(product.price)}</strong>
            <div className="server-shop__actions">
              <button className="ui-button" type="button" disabled={order.isLoading} onClick={() => {
                resetOrderMessage(); setCart((current) => ({ ...current, [product.id]: current[product.id] ?? { product, quantity: '1' } }));
              }}>{t('product.add')}</button>
              <button className="ui-button" type="button" onClick={() => setEditor(product)}>{t('operation.edit')}</button>
            </div>
          </article>)}
        </div>
        {!productsQuery.isFetching && !products.length && !productsQuery.error && <p>{t('server.shop.empty')}</p>}
        <Pagination count={products.length} hasNext={!!productsQuery.hasNextPage} pending={productsQuery.isFetching} error={productsQuery.error} loadMore={loadMore} auto={!editor}
          retry={() => { if (productsQuery.isFetchNextPageError) void productsQuery.fetchNextPage(); else void productsQuery.refetch(); }} />
      </div>
      <section className="server-shop__card" aria-labelledby="cart-title"><h2 id="cart-title">{t('server.shop.cart')}</h2>
        <form noValidate aria-label={t('server.shop.cart')} onSubmit={checkout}>
          {!entries.length && <p>{t('server.shop.cartEmpty')}</p>}
          {entries.map(({ product, quantity }) => <div className="server-shop__cart-row" key={product.id}>
            <strong>{product.name}</strong>
            <FormField label={`${t('server.shop.quantity')}: ${product.name}`} name={product.id} type="number" min="1" max="999" step="1" value={quantity} disabled={order.isLoading} onBlur={() => {}}
              onChange={(event) => { const value = event.target.value; resetOrderMessage(); setCart((current) => ({ ...current, [product.id]: { product, quantity: value } })); }} />
            <span>{money(product.price * (Number(quantity) || 0))}</span>
            <button type="button" className="ui-button" disabled={order.isLoading} onClick={() => { resetOrderMessage(); setCart((current) => { const next = { ...current }; delete next[product.id]; return next; }); }}>{t('server.shop.remove')}</button>
          </div>)}
          {entries.length > 0 && <p><strong>{t('server.shop.total')}: {money(entries.reduce((total, entry) => total + entry.product.price * (Number(entry.quantity) || 0), 0))}</strong></p>}
          {quantityError && <p className="form-field__error" role="alert">{t('server.errors.quantity')}</p>}
          <ApiError error={order.error} />
          {orderId && <p className="homework-form__status" role="status">{t('server.shop.orderCreated', { id: orderId })}</p>}
          <button className="ui-button" type="submit" disabled={!entries.length || order.isLoading}>{t(order.isLoading ? 'signup.sending' : 'server.shop.checkout')}</button>
        </form>
      </section>
      <section aria-labelledby="orders-title"><h2 id="orders-title">{t('server.shop.orders')}</h2>
        {!orders.length && !ordersQuery.isFetching && !ordersQuery.error && <p>{t('server.shop.noOrders')}</p>}
        <ul className="server-shop__list">{orders.map((item) => <li key={item.id} className="server-shop__card">
          <h3>№ {item.id}</h3><p>{item.status === 'pending_confirmation' ? t('server.shop.pending') : item.status}</p>
          <ul>{item.products.map((line, index) => <li key={index}>{line.product?.name} × {line.quantity}</li>)}</ul>
        </li>)}</ul>
        <Pagination count={orders.length} hasNext={!!ordersQuery.hasNextPage} pending={ordersQuery.isFetching} error={ordersQuery.error} auto={false}
          loadMore={() => { if (!ordersQuery.isFetching) void ordersQuery.fetchNextPage(); }} retry={() => { if (ordersQuery.isFetchNextPageError) void ordersQuery.fetchNextPage(); else void ordersQuery.refetch(); }} />
      </section>
    </div>
    {editor && <Modal visible onClose={() => setEditor(null)} label={t(editor === 'new' ? 'server.shop.create' : 'server.shop.edit')}>
      <h2>{t(editor === 'new' ? 'server.shop.create' : 'server.shop.edit')}</h2>
      <ProductEditor product={editor === 'new' ? undefined : editor} onSaved={() => setEditor(null)} />
    </Modal>}
  </section>;
};
