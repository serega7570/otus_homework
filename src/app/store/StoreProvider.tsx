import { useEffect, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createAppStore, type AppStore } from './store';
import { getBrowserStorage } from './tokenStorage';
import { startTokenSync } from './tokenSync';
import { initializeApplication } from './thunks';

export const StoreProvider = ({ children, store: suppliedStore, syncTabs = true }: {
  children: ReactNode; store?: AppStore; syncTabs?: boolean;
}): JSX.Element => {
  const [store] = useState(() => suppliedStore ?? createAppStore(syncTabs ? getBrowserStorage(window) : undefined));
  useEffect(() => {
    if (syncTabs) return startTokenSync(store, window);
    store.dispatch(initializeApplication());
  }, [store, syncTabs]);
  return <Provider store={store}>{children}</Provider>;
};
