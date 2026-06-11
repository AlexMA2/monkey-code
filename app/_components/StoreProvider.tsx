'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { hydrateConfig } from '@store/configSlice';
import NavigationLoader from './NavigationLoader';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate state from localStorage/cookies on mount
    store.dispatch(hydrateConfig());
  }, []);

  // Avoid mismatched HTML during initial SSR render by rendering children normally,
  // hydration will patch the values client-side.
  return (
    <Provider store={store}>
      <NavigationLoader />
      {children}
    </Provider>
  );
}
