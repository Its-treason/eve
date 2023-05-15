'use client';

import { ReactElement } from 'react';
import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider, MantineThemeColorsOverride, MantineTheme } from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';
import { Notifications } from '@mantine/notifications';
import { RouterTransition } from '@eve/panel/feature/core';

const themeOverride: MantineThemeColorsOverride = {
  colorScheme: 'dark',
  colors: {
    dark: [
      '#FFFFFF',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#36393f',
      '#2f3136',
      '#202225',
      '#101113',
    ],
  },
  components: {
    Button: {
      styles: (theme: MantineTheme) => ({
        root: {
          '&[data-disabled]': {
            color: theme.colors.gray[9],
          },
        },
      }),
    },
  },
};

export default function LayoutContexts({ children }: { children: React.ReactNode }): ReactElement {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      key={'emotion-cache'}
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={themeOverride}
        >
          <RouterTransition />
          <Notifications />
          {children}
        </MantineProvider>
      </MantineProvider>
    </CacheProvider>
  );
}
