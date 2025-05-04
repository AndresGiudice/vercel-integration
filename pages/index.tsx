// pages/index.tsx
import Link from "next/link";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar"; // Importar NavBar
import '../styles/styles.css';
import withAuth from '../components/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bag } from '@/utils/types';
import { calculateFinalPrice } from '@/utils/calculateFinalPrice';

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
  const [bags, setBags] = useState<Bag[]>([]);
  const searchQuery = router.query.search as string;

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

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/allPrices');
      const data = await response.json();
      const allBags = [
        ...data.fm,
        ...data.baSu,
        ...data.baKr,
        ...data.fb3x10,
        ...data.fantFb3x100,
        ...data.kraft,
        ...data.blancas,
        ...data.boFae,
        ...data.pa,
        ...data.boSu,
        ...data.boObr,
        ...data.boKr,
      ];
      setBags(allBags);
    })();
  }, []);

  const filteredBags = bags.filter((bag) =>
    bag.description.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (!user) {
    return null;
  }

  return (
    <div>
      <NavBar />
      <main className={`main ${inter.className}`} style={{ marginTop: '4rem' }}>
        {!searchQuery ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">
              Bienvenido a nuestro <br /> E-Commerce
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Explora nuestros productos o utiliza el buscador para encontrar lo que necesitas.
            </p>
          </div>
        ) : (
          <div className="container mx-auto p-4">
            <h2 className="text-lg font-semibold mb-4">
              Resultados para: "{searchQuery}"
            </h2>
            {filteredBags.length > 0 ? (
              <div className="flex flex-wrap justify-evenly">
                {filteredBags.map((bag, index) => (
                  <div
                    key={index}
                    className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  >
                    <div className="p-2">
                      <p className="text-center text-gray-700 font-medium">
                        {bag.description}
                      </p>
                      <p className="text-center text-gray-700">
                        Precio:  {calculateFinalPrice(user?.priceList || '', bag)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron resultados para "{searchQuery}".
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(HomePage);