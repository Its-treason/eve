'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  startNavigationProgress,
  resetNavigationProgress,
  NavigationProgress,
} from '@mantine/nprogress';

export default function RouterTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    // TODO: Old router.events are not supported as of 13.4.1. Check if this changes in a further version
    // Documentation: https://nextjs.org/docs/app/api-reference/functions/use-router#router-events
    startNavigationProgress();

    const timeoutRef = setTimeout(() => {
      resetNavigationProgress();
    }, 500);

    return () => {
      clearTimeout(timeoutRef);
      resetNavigationProgress();
    };
  }, [pathname, searchParams]);

  return <NavigationProgress />;
}
