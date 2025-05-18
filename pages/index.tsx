// pages/index.tsx
import Link from "next/link";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar"; // Importar NavBar
import '../styles/styles.css';
import withAuth from '../components/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

interface User {
  _id: string;
  name: string;
  email: string;
  priceList: string;
  // ...other properties if needed
}

function HomePage() {
  const router = useRouter();
  const { user: userId } = router.query;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof userId === 'string') {
        const response = await fetch(`/api/user?id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } else {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const assignedUser = JSON.parse(localStorage.getItem('assignedUser') || 'null');
        setUser(storedUser || assignedUser);
      }
    };

    fetchUser();
  }, [userId]);

  // Remove the loading message
  if (!user) {
    return null;
  }

  return (
    <div>
      <NavBar />
      <main
        className={`main min-h-[100vh] ${inter.className}`}
      >
        <div className="flex justify-center items-center w-full">
          <h1 className="text-center text-4xl font-bold text-black">
            Bienvenido a nuestro <br /> E-Commerce
          </h1>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomePage);