import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import './global.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Grapper Admin',
  description: 'Admin dashboard for Grapper',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://kit.fontawesome.com/2c15cc0cc7.js"
          crossOrigin="anonymous"
          async
        ></script>
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
