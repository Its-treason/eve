import { createGetInitialProps } from '@mantine/next';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';

const mantineGetInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = (ctx: DocumentContext) => {
    // react-beautiful-dnd does not work correctly with ssr. Resetting the ServerContext is a workaround for this
    resetServerContext();

    // Needed for Mantine to work with SSR
    return mantineGetInitialProps(ctx);
  };

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
