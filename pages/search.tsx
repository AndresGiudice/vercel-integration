import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { useCart } from '../context/CartContext';
import AddToCartButton from './components/AddToCartButton';
import { calculateFinalPrice } from '../utils/calculateFinalPrice';
import { Bag } from '../utils/types';
import { useUser } from '../context/UserContext'; // Import useUser
import { handleAddToCartUtil } from "@/utils/addToCartUtil";

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState<Bag[]>([]);
  const { addToCart, cart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { user } = useUser(); // Get user from context

  useEffect(() => {
    if (query) {
      (async () => {
        const response = await fetch(`/api/allPrices`);
        const data = await response.json();

        const filterBags = (bags: Bag[]) => {
          const queryWords = (query as string).toLowerCase().split(/\s+/);
          return bags.filter((bag: Bag) => {
            const combinedText = `${bag.description} ${bag.additionalDescription || ''}`.toLowerCase();
            return queryWords.every((word) => combinedText.includes(word));
          });
        };

        const filteredResults = [
          ...filterBags(data.kraft),
          ...filterBags(data.blancas),
          ...filterBags(data.pa),
          ...filterBags(data.boFae),
          ...filterBags(data.fb3x100),
          ...filterBags(data.fb3x10),
        ];

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
    handleAddToCartUtil(
      systemCode,
      description,
      list4,
      results,
      user.priceList,
      quantities,
      addToCart,
      setQuantities
    );
  };

  const calculateDiscountedPrice = (price: number, systemCode: string) => {
    const eligibleSystemCodes = [
      "BFB3F53", "BFB3F54", "BFB3F45", "BFB3F40", "BFB3F57", "BFB3F50",
      "BFB3F36", "BFB3F41", "BFB3F38", "BFB3F58", "BFB301", "BFB3F44",
      "BFB3F56", "BFB3F52", "BFB3F51", "BFM301", "BFB3F39"
    ];

    const totalEligibleItems = Object.values(cart)
      .filter((item) => eligibleSystemCodes.includes(item.code))
      .reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity for eligible system codes

    return eligibleSystemCodes.includes(systemCode) && totalEligibleItems >= 100 ? price * 0.9 : price;
  };

  if (!user) {
    return null; // Ensure user is loaded before rendering
  }

  return (
    <div>
      <NavBar />
      <main className="main" style={{ marginTop: '4rem' }}>
        <div className="flex flex-wrap justify-evenly">
          {results.length > 0 ? (
            results.map((bag, index) => (
              <div
                className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                key={index}
              >
                <img
                  className="w-72 h-36 object-contain"
                  src={
                    results.some((b: Bag) => b.systemCode === bag.systemCode && (
                      b.description.toLowerCase().includes("fast food fb3 pleno x 100 u.") ||
                      b.systemCode.toLowerCase().includes("bfm301") ||
                      b.description.toLowerCase().includes("fast food fb3 blanca x 100 u.")
                    ))
                      ? `/Bolsa Fast Food FB3 Pleno ${bag.additionalDescription || bag.systemCode}.png`
                      : results.some((b: Bag) => 
                        b.systemCode === bag.systemCode && (
                          b.description.toLowerCase().includes("fast food fb3 blanca x 10 u.") ||
                          b.description.toLowerCase().includes("fast food fb3 pleno x 10 u.") ||
                          b.systemCode.toLowerCase().includes("bfm3p10")
                        )
                      )
                        ? `/BOLSA FAST FOOD FB3 PLENO X 10 U. ${bag.additionalDescription || bag.systemCode}.jpg`
                        : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("blanca"))
                          ? "/bolsas-blancas.jpg"
                          : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("pa"))
                            ? `/Bolsa de Color ${bag.additionalDescription}.jpg`
                            : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fantasia"))
                              ? `/Bolsa Fantasia ${bag.additionalDescription}.png`
                              : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("kraft"))
                                ? "/bolsas-kraft.jpg"
                                : ""
                  }
                  alt={
                    results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("pa"))
                      ? `Bolsa de Color ${bag.description.replace(/Bolsas\s*/i, '')}`
                      : bag.description || "Bolsa"
                  }
                />
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
                                  {bag.description.replace(/\bBolsa(s)?\b\s*/i, '')}
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
                  <p className="text-gray-700 text-lg">
                    Precio x100:
                    <span className="font-bold">
                      {(() => {
                        const finalPriceString = calculateFinalPrice(user.priceList, bag);
                        const finalPrice = parseFloat(finalPriceString.replace('$', '')); // Extract numeric value
                        return `$${Math.floor(calculateDiscountedPrice(finalPrice, bag.systemCode))}`; // Round down
                      })()}
                    </span>
                  </p>
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
                    handleAddToCart={handleAddToCart} list3={0} list2={0} />
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