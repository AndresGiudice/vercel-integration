import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback } from "react";
import NavBar from '../../components/NavBar';
import { useCart } from '../../../context/CartContext';
import '../../../styles/styles.css';

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
  list4: number;
  systemCode: string;
  additionalDescription: string;
};

export default function BolsasConManijaColor({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [bags, setBags] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [description: string]: { [systemCode: string]: number } }>({});
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/allPrices");
        const data = await response.json();
        const order = ["BG1P001", "BG1P002", "BG1P003", "BG1P004", "BG1P00S", "BG3P001", "BG3P002", "BG3P003", "BG3P004", "BG3P00S", "BG5P001", "BG5P002", "BG5P003", "BG5P004", "BG5P00S"];
        const processedData = data.pa
          .map((bag: Bag) => ({
            ...bag,
            description: bag.description.slice(7, 9),
          }))
          .sort((a: Bag, b: Bag) => order.indexOf(a.systemCode) - order.indexOf(b.systemCode));
        setBags(processedData);
        const initialQuantities = processedData.reduce((acc: any, bag: Bag) => {
          if (!acc[bag.additionalDescription]) {
            acc[bag.additionalDescription] = {};
          }
          acc[bag.additionalDescription][bag.systemCode] = 0;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching bag handles:", error);
      }
    })();
  }, []);

  const handleIncrement = useCallback((description: string, systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [description]: {
        ...prevQuantities[description],
        [systemCode]: (prevQuantities[description][systemCode] || 0) + 1,
      },
    }));
  }, []);

  const handleDecrement = useCallback((description: string, systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [description]: {
        ...prevQuantities[description],
        [systemCode]: Math.max((prevQuantities[description][systemCode] || 0) - 1, 0),
      },
    }));
  }, []);

  const handleQuantityChange = useCallback((description: string, systemCode: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [description]: {
          ...prevQuantities[description],
          [systemCode]: numberValue,
        },
      }));
    }
  }, []);

  const handleAddToCart = useCallback((description: string, bag: Bag) => {
    const quantity = quantities[description][bag.systemCode];
    if (quantity > 0) {
      addToCart(bag.systemCode, quantity, description, bag.list4, bag.systemCode, bag.systemCode);
    }

    // Reset quantity to zero after adding to cart
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [description]: {
        ...prevQuantities[description],
        [bag.systemCode]: 0,
      },
    }));
  }, [addToCart, quantities]);

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = useCallback(() => {
    alert('Pedido realizado con éxito!');
    clearCart();
  }, [clearCart]);

  const groupedBags = bags.reduce((acc: { [key: string]: Bag[] }, bag: Bag) => {
    if (!acc[bag.additionalDescription]) {
      acc[bag.additionalDescription] = [];
    }
    acc[bag.additionalDescription].push(bag);
    return acc;
  }, {});

  const sortedGroupedBags = Object.keys(groupedBags).sort((a, b) => {
    if (a === "Surtido") return 1;
    if (b === "Surtido") return -1;
    return a.localeCompare(b);
  }).reduce((acc: { [key: string]: Bag[] }, key: string) => {
    acc[key] = groupedBags[key];
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
              {Object.entries(sortedGroupedBags).map(([additionalDescription, bags]) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={additionalDescription}
                >
                  <img className="w-72 h-36 object-contain" src={`/Bolsa de Color ${additionalDescription}.jpg`} alt={additionalDescription} />
                  <div className="px-4 py-1 ">
                    {bags.slice(0, 3).map((bag) => (
                      <div key={bag.systemCode}>
                        <div className="flex justify-center mb-2">
                          <p className="text-gray-700 text-base mt-2">{bag.description} - Precio x100: <span className="font-bold">${Math.round(bag.list4)}</span></p>
                        </div>
                        <div className="w-full bg-gray-200 p-1 rounded-lg">
                          <div className="flex items-center justify-between">
                            <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(additionalDescription, bag.systemCode)}>-</button>
                            <input
                              type="number"
                              className="w-16 text-center bg-gray-200 no-arrows text-black"
                              value={quantities[additionalDescription][bag.systemCode]}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setQuantities((prevQuantities) => ({
                                    ...prevQuantities,
                                    [additionalDescription]: {
                                      ...prevQuantities[additionalDescription],
                                      [bag.systemCode]: 0,
                                    },
                                  }));
                                } else {
                                  handleQuantityChange(additionalDescription, bag.systemCode, value);
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                            />
                            <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(additionalDescription, bag.systemCode)}>+</button>
                          </div>
                        </div>
                        <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer" onClick={() => handleAddToCart(additionalDescription, bag)}>
                          <i className="fas fa-shopping-cart cart-icon text-xl mr-1"></i>
                          <span className="px-2 py-1">Agregar al carrito</span>
                        </div>
                      </div>
                    ))}
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