import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const authToken = localStorage.getItem('authToken');
      const assignedUser = JSON.parse(localStorage.getItem('assignedUser'));

      if (!authToken && !assignedUser && !url.includes('/loginUser') && !url.includes('/assignedUsers')) {
        router.push('/loginUser');
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
