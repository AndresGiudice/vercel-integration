import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback } from "react";
import NavBar from '../components/NavBar';
import { useCart } from '../../context/CartContext';
import '../../styles/styles.css';
import AddToCartButton from "@/pages/components/AddToCartButton";
import { useRouter } from 'next/router';


type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
ConnectionStatus
> = async () => {
try {
  const client = await clientPromise;
  await client.connect();
  return {
    props: { isConnected: true },
  };
} catch (e) {
  console.error(e);
  return {
    props: { isConnected: false },
  };
}
};
  
type Bag = {
  description: string;
  list4: number;
  list3: number;
  list2: number;
  systemCode: string; 
};

const  BolsasConManijaBlancas = ({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);
  const router = useRouter();
  const folderName = router.pathname.split('/').slice(-2, -1)[0];

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/allPrices");
      const data = await response.json();
      const order = ["B00B0", "BG0B0", "B1AB0", "BG1B0", "BG1BG", "BG2B0", "BG3B0", "BG4B0", "BG5B0", "BG7B0", "BBB00", "BG8B0", "B11B0"];
      const processedData = data.blancas
        .map((bag: Bag) => ({
          ...bag,
          description: bag.description.replace(/^Bolsas\s*/, "").replace(/\s*x\s*100\s*u\.?$/, ""),
        }))
        .sort((a: Bag, b: Bag) => order.indexOf(a.systemCode) - order.indexOf(b.systemCode));
      setBags(processedData);
      const initialQuantities = processedData.reduce((acc: any, bag: Bag) => {
        acc[bag.systemCode] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    })();
  }, []);

  const handleIncrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: prevQuantities[systemCode] + 1,
    }));
  };

  const handleDecrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: Math.max(prevQuantities[systemCode] - 1, 0),
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

  const handleAddToCart = (systemCode: string, description: string) => {
    bags.forEach((bag, index) => {
      if (quantities[bag.systemCode] > 0) {
        let price = bag.list2; // Default to list2
        if (folderName === 'lista2-10') {
          price = bag.list2;
        } else if (folderName === 'lista2-10-2') {
          price = bag.list2;
        } else if (folderName === 'lista2-final') {
          price = bag.list2;
        } else if (folderName === 'lista2-10-final') {
          price = bag.list2;
        } else if (folderName === 'lista2-10-2-final') {
          price = bag.list2;
        } else if (folderName === 'lista3') {
          price = bag.list3;
        } else if (folderName === 'lista3-10') {
          price = bag.list3;
        } else if (folderName === 'lista3-10-2') {
          price = bag.list3;
        } else if (folderName === 'lista3-final') {
          price = bag.list3;
        } else if (folderName === 'lista3-10-final') {
          price = bag.list3;
        } else if (folderName === 'lista3-10-2-final') {
          price = bag.list3;
        } else if (folderName === 'lista4') {
          price = bag.list4;
        } else if (folderName === 'lista4-10') {
          price = bag.list4;
        } else if (folderName === 'lista4-10-2') {
          price = bag.list4;
        } else if (folderName === 'lista4-final') {
          price = bag.list4;
        } else if (folderName === 'lista4-10-final') {
          price = bag.list4;
        } else if (folderName === 'lista4-10-2-final') {
          price = bag.list4;
        }
        addToCart(bag.systemCode, quantities[bag.systemCode], `${bag.description}`, price);
      }
    });
    setQuantities(bags.reduce((acc, bag) => ({ ...acc, [bag.systemCode]: 0 }), {}));
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = () => {
    alert('Pedido realizado con éxito!');
    clearCart();
  };

  return (
    <div>
      <NavBar />
      <main className={`main ${inter.className}`} style={{ marginTop: '4rem'}}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:space-x-4">
          {showCartDetails && totalItems > 0 && (
            <div className="lg:w-1/4 p-4 bg-white shadow-lg rounded-lg mt-4 lg:mt-0 order-1 lg:order-2">
              <h2 className="text-lg font-semibold">Carrito de Compras</h2>
              <ul>
                {Object.entries(cart).map(([product, quantity]) => (
                  <li key={product} className="flex justify-between py-2">
                    <span>{product}</span>
                    <span>{quantity.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={placeOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Realizar Pedido
                </button>
              </div>
            </div>
          )}
          <div className="lg:flex-1 order-2 lg:order-1">
            <div className="flex flex-wrap justify-evenly">
              {bags.map((bag, index) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={index}
                >
                  <img className="w-72 h-36 object-contain" src="/bolsas-blancas.jpg" alt="Bolsa con Manija Blanca" />
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
                    <p className="text-gray-700 text-lg">
                      Precio x und. : 
                      <span className="font-bold">
                        {(() => {
                          let finalPrice = 0;

                          if (folderName === 'lista2') {
                            finalPrice = bag.list2 / 1.105;
                          } else if (folderName === 'lista2-10') {
                            finalPrice = (bag.list2 * 0.9) / 1.105;
                          } else if (folderName === 'lista2-10-2') {
                            finalPrice = (bag.list2 * 0.8802) / 1.105;
                          } else if (folderName === 'lista2-final') {
                            finalPrice = bag.list2;
                          } else if (folderName === 'lista2-10-final') {
                            finalPrice = bag.list2 * 0.9;
                          } else if (folderName === 'lista2-10-2-final') {
                            finalPrice = bag.list2 * 0.8802;
                          } else if (folderName === 'lista3') {
                            finalPrice = bag.list3 / 1.105;
                          } else if (folderName === 'lista3-10') {
                            finalPrice = (bag.list3 * 0.9) / 1.105;
                          } else if (folderName === 'lista3-10-2') {
                            finalPrice = (bag.list3 * 0.8802) / 1.105;
                          } else if (folderName === 'lista3-final') {
                            finalPrice = bag.list3;
                          } else if (folderName === 'lista3-10-final') {
                            finalPrice = bag.list3 * 0.9;
                          } else if (folderName === 'lista3-10-2-final') {
                            finalPrice = bag.list3 * 0.8802;
                          } else if (folderName === 'lista4') {
                            finalPrice = bag.list4 / 1.105;
                          } else if (folderName === 'lista4-10') {
                            finalPrice = (bag.list4 * 0.9) / 1.105;
                          } else if (folderName === 'lista4-10-2') {
                            finalPrice = (bag.list4 * 0.8802) / 1.105;
                          } else if (folderName === 'lista4-final') {
                            finalPrice = bag.list4;
                          } else if (folderName === 'lista4-10-final') {
                            finalPrice = bag.list4 * 0.9;
                          } else if (folderName === 'lista4-10-2-final') {
                            finalPrice = bag.list4 * 0.8802;
                          }
                          return `$${Math.round(finalPrice)}`;
                        })()}
                      </span>
                    </p>
                  </div>
                  <div className="px-4 py-1 ">
                    <div className="w-full bg-gray-200 p-1 rounded-lg">
                      <div className="flex items-center justify-between">
                        <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(bag.systemCode)}>-</button>
                        <input
                          type="number"
                          className="w-16 text-center bg-gray-200 no-arrows text-black"
                          value={quantities[bag.systemCode]}
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
                      list3={bag.list3}
                      list2={bag.list2}
                      quantity={quantities[bag.systemCode]}
                      handleAddToCart={() => handleAddToCart(bag.systemCode, bag.description)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center bg-[#efefef] py-4">
        <p>{folderName.toUpperCase()}</p>
      </footer>
    </div>
  );
}

export default BolsasConManijaBlancas;