'use client';

import { setPageLoading } from '@store/configSlice';
import { useAppDispatch } from '@store/hooks';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationLoader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  }, [pathname, dispatch]);

  return null;
}
