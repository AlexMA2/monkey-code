'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@store/store';
import { hydrateConfig } from '@store/configSlice';
import NavigationLoader from './NavigationLoader';
import { useAppDispatch } from '@store/hooks';

function StoreInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateConfig());
  }, [dispatch]);

  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <StoreInitializer />
      <NavigationLoader />
      {children}
    </Provider>
  );
}
