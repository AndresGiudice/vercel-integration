import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { useCart } from '../context/CartContext';
import AddToCartButton from './components/AddToCartButton';

type Bag = {
  description: string;
  list4: number;
  systemCode: string;
};

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState<Bag[]>([]);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (query) {
      (async () => {
        const response = await fetch(`/api/allPrices`);
        const data = await response.json();
        const filteredResults = data.kraft.filter((bag: Bag) =>
          bag.description.toLowerCase().includes((query as string).toLowerCase())
        );
        setResults(filteredResults);
      })();
    }
  }, [query]);

  const handleIncrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: (prevQuantities[systemCode] || 0) + 1,
    }));
  };

  const handleDecrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: Math.max((prevQuantities[systemCode] || 0) - 1, 0),
    }));
  };

  const handleQuantityChange = (systemCode: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [systemCode]: numberValue,
      }));
    }
  };

  const handleAddToCart = (systemCode: string, description: string, list4: number) => {
    addToCart(systemCode, quantities[systemCode] || 0, description, list4);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: 0,
    }));
  };

  return (
    <div>
      <NavBar />
      <main className="main" style={{ marginTop: '4rem' }}>
        <h1 className="text-2xl font-bold text-center mb-4">Resultados de búsqueda para: "{query}"</h1>
        <div className="flex flex-wrap justify-evenly">
          {results.length > 0 ? (
            results.map((bag, index) => (
              <div
                className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                key={index}
              >
                <img className="w-72 h-36 object-contain" src="/bolsas-kraft.jpg" alt="Bolsa con Manija Kraft" />
                <div className="container mx-auto p-2">
                  <div className="flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="py-2 inline-block min-w-full">
                        <div className="overflow-hidden">
                          <table className="min-w-full table-fixed">
                            <thead className="border-b">
                              <tr>
                                <th scope="col" className="w-1/4 text-base font-medium text-gray-900 px-2 py-2 text-center">
                                  Descripción & Medidas
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-2 py-2 whitespace-nowrap text-base font-medium text-gray-900 text-center align-middle">
                                  {bag.description}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mb-2">
                  <p className="text-gray-700 text-lg"> Precio x100: <span className="font-bold">${Math.round(bag.list4 / 1.105)}</span></p>
                </div>
                <div className="px-4 py-1">
                  <div className="w-full bg-gray-200 p-1 rounded-lg">
                    <div className="flex items-center justify-between">
                      <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(bag.systemCode)}>-</button>
                      <input
                        type="number"
                        className="w-16 text-center bg-gray-200 no-arrows text-black"
                        value={quantities[bag.systemCode] || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setQuantities((prevQuantities) => ({
                              ...prevQuantities,
                              [bag.systemCode]: 0,
                            }));
                          } else {
                            handleQuantityChange(bag.systemCode, value);
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                      <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(bag.systemCode)}>+</button>
                    </div>
                  </div>
                  <AddToCartButton
                            systemCode={bag.systemCode}
                            description={bag.description}
                            list4={bag.list4}
                            quantity={quantities[bag.systemCode] || 0}
                            handleAddToCart={handleAddToCart} list3={0} list2={0}                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No se encontraron resultados.</p>
          )}
        </div>
      </main>
    </div>
  );
}