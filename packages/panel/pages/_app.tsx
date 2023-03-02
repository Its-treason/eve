import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, MantineTheme, MantineThemeColorsOverride } from '@mantine/core';
import { RouterTransition } from '@eve/panel/feature/core';
import { Notifications } from '@mantine/notifications';

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

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>EVE</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={themeOverride}
      >
        <RouterTransition />
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
