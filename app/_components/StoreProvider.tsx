'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../_store/store';
import { hydrateConfig } from '../_store/configSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate state from localStorage/cookies on mount
    store.dispatch(hydrateConfig());
    setHydrated(true);
  }, []);

  // Avoid mismatched HTML during initial SSR render by rendering children normally,
  // hydration will patch the values client-side.
  return <Provider store={store}>{children}</Provider>;
}
