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

        const filterBags = (bags: Bag[], isFb3x10 = false, isFb3x100 = false) => {
          // Función para quitar acentos
          const normalize = (str: string) =>
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          const queryString = normalize((query as string).toLowerCase());
          const queryWords = queryString.split(/\s+/);

          return bags.filter((bag: Bag) => {
            const combinedText = normalize(
              `${bag.description} ${bag.additionalDescription || ''}`.toLowerCase()
            );

            // Si es fb3x10 y la búsqueda es "fb3 x10" o "fast food x10", mostrar todos los fb3x10
            if (
              isFb3x10 &&
              (
                queryString.includes("fb3 x10") ||
                queryString.includes("fast food x10")
              )
            ) {
              return true;
            }

            // Si es fb3x100 y la búsqueda es "fb3 x100" o "fast food x100", mostrar todos los fb3x100
            if (
              isFb3x100 &&
              (
                queryString.includes("fb3 x100") ||
                queryString.includes("fast food x100")
              )

            ) {
              return true;
            }



            return queryWords.every((word) => combinedText.includes(word));
          });
        };

        const queryString = (query as string).toLowerCase();

        const filteredResults = [
          ...filterBags(data.kraft),
          ...filterBags(data.blancas),
          ...filterBags(data.pa),
          ...filterBags(data.boFae),
          ...filterBags(data.fb3x100, false, true), // Pasa true para fb3x100
          // Solo incluye fb3x10 si la búsqueda NO es "fb3 x100" o "fast food x100"
          ...(
            queryString.includes("fb3 x100") || queryString.includes("fast food x100")
              ? []
              : filterBags(data.fb3x10, true)
          ),
          ...filterBags(data.fantFb3x100),
          ...filterBags(
            data.fm.map((bag: Bag) => ({
              ...bag,
          
              isFM: true, // Marca las bolsas FM
            }))
          ),
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
    const eligibleSystemCodesFb3 = [
      "BFB3F53", "BFB3F54", "BFB3F45", "BFB3F40", "BFB3F57", "BFB3F50",
      "BFB3F36", "BFB3F41", "BFB3F38", "BFB3F58", "BFB301", "BFB3F44",
      "BFB3F56", "BFB3F52", "BFB3F51", "BFM301", "BFB3F39"
    ];

    const eligibleSystemCodesFb310 = [
      "BFB3P133", "BFB3P113", "BFB3P122", "BFB3P10", "BFB3P114", "BFB3P116",
      "BFB3P126", "BFB3P115", "BFB3P132", "BFB3P125", "BFB3P112", "BFM3P10",
      "BFB3P117", "BFB3P124", "BFB3P123", "BFB3P134", "BFB3P160"
    ];

    const eligibleSystemCodesFb3Fant = [
      "BFB3F81",
      "BFB3F79",
      "BFB3F76",
      "BFB3F82",
      "BFB3F73",
      "BFB3F78",
      "BFB3F74",
      "BFB3F75",
      "BFB3F80",
      "BFB3F77"
    ];

    const totalEligibleItems = Object.values(cart)
      .filter((item) =>
        eligibleSystemCodesFb3.includes(item.code) ||
        eligibleSystemCodesFb3Fant.includes(item.code)
      )
      .reduce((sum, item) => sum + item.quantity, 0);

    const totalEligibleItems10 = Object.values(cart)
      .filter((item) => eligibleSystemCodesFb310.includes(item.code))
      .reduce((sum, item) => sum + item.quantity, 0);

    if (
      (
        (eligibleSystemCodesFb3.includes(systemCode) ||
          eligibleSystemCodesFb3Fant.includes(systemCode)
        ) && totalEligibleItems >= 100
      ) ||
      (eligibleSystemCodesFb310.includes(systemCode) && totalEligibleItems10 >= 100)
    ) {
      return price * 0.9;
    }
    return price;
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
                  className="w-72 h-36 object-contain mx-auto block"
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
                        : results.some((b: Bag) =>
                          b.systemCode === bag.systemCode &&
                          b.description.toLowerCase().includes("fast food fb3 fantasía")
                        )
                          ? `/Bolsa Fast Food FB3 Fantasia x 100 u. ${bag.additionalDescription}.png`
                          : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("blanca"))
                            ? "/bolsas-blancas.jpg"
                            : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("pa"))
                              ? `/Bolsa de Color ${bag.additionalDescription}.jpg`
                              : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fantasia"))
                                ? `/Bolsa Fantasia ${bag.additionalDescription}.png`
                                : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fast food fm"))
                                  ? `/Bolsa Fast Food ${bag.systemCode}.png`
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
                    {bag.isFM ? "Precio x1000:" : "Precio x100:"}
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