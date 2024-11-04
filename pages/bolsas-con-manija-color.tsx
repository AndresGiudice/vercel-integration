import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback } from "react";
import NavBar from './components/NavBar';
import { useCart } from '../context/CartContext';
import '../styles/styles.css';

type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async () => {
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

export default function BolsasConManijaColor({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [CPBagHandles, setCPBagHandles] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [description: string]: { [code: string]: number } }>({});
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const results = await fetch("/api/list?collection=CPBagHandles");
        const resultsJson = await results.json();
        setCPBagHandles(resultsJson);
        const initialQuantities = resultsJson.reduce((acc: any, bag: Bag) => {
          if (!acc[bag.description]) {
            acc[bag.description] = {};
          }
          acc[bag.description][bag.code] = 0;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching bag handles:", error);
      }
    })();
  }, []);

  const handleIncrement = useCallback((description: string, code: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [description]: {
        ...prevQuantities[description],
        [code]: (prevQuantities[description][code] || 0) + 1,
      },
    }));
  }, []);

  const handleDecrement = useCallback((description: string, code: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [description]: {
        ...prevQuantities[description],
        [code]: Math.max((prevQuantities[description][code] || 0) - 1, 0),
      },
    }));
  }, []);

  const handleQuantityChange = useCallback((description: string, code: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [description]: {
          ...prevQuantities[description],
          [code]: numberValue,
        },
      }));
    }
  }, []);

  const handleAddToCart = useCallback((description: string, bags: Bag[]) => {
    bags.forEach((bag) => {
      const quantity = quantities[description][bag.code];
      if (quantity > 0) {
        addToCart(bag.code, quantity, description, bag.price, bag.systemCode, bag.code);
      }
    });

    // Reset quantities to zero after adding to cart
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      bags.forEach((bag) => {
        newQuantities[description][bag.code] = 0;
      });
      return newQuantities;
    });
  }, [addToCart, quantities]);

  // Ensure showCartDetails is not modified in any useEffect or other logic
  useEffect(() => {
    // Example of ensuring showCartDetails is not modified
    // setShowCartDetails(false);
  }, []);

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = useCallback(() => {
    alert('Pedido realizado con éxito!');
    clearCart();
  }, [clearCart]);

  const groupedBags = CPBagHandles.reduce((acc: { [key: string]: Bag[] }, bag: Bag) => {
    if (!acc[bag.description]) {
      acc[bag.description] = [];
    }
    acc[bag.description].push(bag);
    return acc;
  }, {});

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
              {Object.entries(groupedBags).map(([description, bags]) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={description}
                >
                  <img className="w-72 h-36 object-contain" src={`/${description}.jpg`} alt={description} />
                  <div className="px-4 py-1 ">
                    {bags.map((bag) => (
                      <div key={bag.code}>
                        <div className="flex justify-center mb-2">
                          <p className="text-gray-700 text-base mt-2">{bag.code} - Precio x100: <span className="font-bold">${Math.round(bag.price)}</span></p>
                        </div>
                        <div className="w-full bg-gray-200 p-1 rounded-lg">
                          <div className="flex items-center justify-between">
                            <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(description, bag.code)}>-</button>
                            <input
                              type="number"
                              className="w-16 text-center bg-gray-200 no-arrows text-black"
                              value={quantities[description][bag.code]}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setQuantities((prevQuantities) => ({
                                    ...prevQuantities,
                                    [description]: {
                                      ...prevQuantities[description],
                                      [bag.code]: 0,
                                    },
                                  }));
                                } else {
                                  handleQuantityChange(description, bag.code, value);
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                            />
                            <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(description, bag.code)}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer" onClick={() => handleAddToCart(description, bags)}>
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