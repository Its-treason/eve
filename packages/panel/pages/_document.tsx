import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd'

const mantineGetInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = (ctx: any) => {
    resetServerContext()
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
