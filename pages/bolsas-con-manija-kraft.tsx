import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import NavBar from './components/NavBar';
import { useCart } from '../context/CartContext';
import '../styles/styles.css';

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
  code: string;
  price: number;
  width: number;
  height: number;
  depth: number;
  systemCode: string; 
};

export default function BolsasConManijaKraft({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [KPBagHandles, setKPBagHandles] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    (async () => {
      const results = await fetch("/api/list?collection=KPBagHandles");
      const resultsJson = await results.json();
      setKPBagHandles(resultsJson);
      const initialQuantities = resultsJson.reduce((acc: any, bag: Bag) => {
        acc[bag.code] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    })();
  }, []);

  const handleIncrement = (code: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [code]: prevQuantities[code] + 1,
    }));
  };

  const handleDecrement = (code: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [code]: Math.max(prevQuantities[code] - 1, 0),
    }));
  };

  const handleQuantityChange = (code: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [code]: numberValue,
      }));
    }
  };

  const handleAddToCart = (code: string, description: string, price: number, systemCode: string) => {
    addToCart(code, quantities[code], description, price, systemCode, code);
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = () => {
    alert('Pedido realizado con éxito!');
    clearCart();
  };

  return (
    <div>
      <NavBar />
      {/* <div className="text-center my-4">
        <h2 className="text-2xl font-bold mt-10">Bolsas con Manija Kraft</h2>
      </div> */}
      <main className={`main ${inter.className}`} style={{ marginTop: '6rem'}}>
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
              {KPBagHandles.map((bag, index) => (
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
                                  <th scope="col" className="w-1/4 text-sm font-medium text-gray-900 px-2 py-2 text-center">
                                    Código
                                  </th>
                                  <th scope="col" className="w-1/4 text-sm font-medium text-gray-900 px-2 py-2 text-center">
                                    Ancho
                                  </th>
                                  <th scope="col" className="w-1/4 text-sm font-medium text-gray-900 px-2 py-2 text-center">
                                    Alto
                                  </th>
                                  <th scope="col" className="w-1/4 text-sm font-medium text-gray-900 px-2 py-2 text-center">
                                    Fuelle
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                    {bag.code}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                    {bag.width}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                    {bag.height}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                    {bag.depth}
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
                    <p className="text-gray-700 text-lg"> Precio x100: <span className="font-bold">${Math.round(bag.price)}</span></p>
                  </div>
                  <div className="px-4 py-1 ">
                    <div className="w-full bg-gray-200 p-1 rounded-lg">
                      <div className="flex items-center justify-between">
                        <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(bag.code)}>-</button>
                        <input
                          type="number"
                          className="w-16 text-center bg-gray-200 no-arrows text-black"
                          value={quantities[bag.code]}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setQuantities((prevQuantities) => ({
                                ...prevQuantities,
                                [bag.code]: 0,
                              }));
                            } else {
                              handleQuantityChange(bag.code, value);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                        <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(bag.code)}>+</button>
                      </div>
                    </div>
                    <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer" onClick={() => handleAddToCart(bag.code, bag.description, bag.price, bag.systemCode)}>
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
    </div>
  );
}