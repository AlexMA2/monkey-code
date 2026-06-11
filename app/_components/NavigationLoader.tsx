'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../_store/hooks';
import { setPageLoading } from '../_store/configSlice';
import Loading from '../loading';

export default function NavigationLoader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.config.isPageLoading);

  useEffect(() => {
    // Hide loader whenever pathname changes (navigation completed)
    dispatch(setPageLoading(false));
  }, [pathname, dispatch]);

  return null;
}
