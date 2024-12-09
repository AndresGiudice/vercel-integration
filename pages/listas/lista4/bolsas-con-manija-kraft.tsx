import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import NavBar from '../../components/NavBar';
import { useCart } from '../../../context/CartContext';
import '../../../styles/styles.css';

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
  systemCode: string; 
};

export default function BolsasConManijaKraft({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [bags, setBags] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/allPrices");
      const data = await response.json();
      const order = ["B00K0", "BG0K0", "B1AK0", "BG1K0", "BG1KG", "BG2K0", "BG3K0", "BG4K0", "BG5K0", "BG7K0", "BBK00", "BBCK0", "BDBK0", "B8AK0", "BG8K0", "BG9K0", "B10K0", "B11K0"];
      const processedData = data.kraft
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

  const handleAddToCart = (systemCode: string, description: string, list4: number) => {
    const cleanedDescription = description.replace(/(Kraft).*/, 'Kraft');
    addToCart(systemCode, quantities[systemCode], cleanedDescription, list4);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: 0,
    }));
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
                    <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer" onClick={() => handleAddToCart(bag.systemCode, bag.description, bag.list4)}>
                      <i className="fas fa-shopping-cart cart-icon text-xl mr-1"></i>
                      <span className="px-2 py-1">Agregar al carrito</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center bg-[#efefef] py-4">
        <p>LISTA 4 FINAL</p>
      </footer>
    </div>
  );
}