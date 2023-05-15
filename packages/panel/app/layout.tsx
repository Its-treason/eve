import LayoutContexts from './LayoutContexts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <LayoutContexts>
          {children}
        </LayoutContexts>
      </body>
    </html>
  );
}
