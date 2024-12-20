// pages/_app.tsx
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import '../styles/globals.css';

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </CartProvider>
  );
}

export default MyApp;