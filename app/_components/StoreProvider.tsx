'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/store';
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
  return (
    <Provider store={store}>
      <StoreInitializer />
      <NavigationLoader />
      {children}
    </Provider>
  );
}
