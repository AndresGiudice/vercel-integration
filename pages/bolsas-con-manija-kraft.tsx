import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import NavBar from './components/NavBar'; // Importar NavBar
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
  code: string;
  price: number;
  width: number;
  height: number;
  depth: number;
};

export default function BolsasConManijaKraft({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [KPBagHandles, setKPBagHandles] = useState<Bag[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const results = await fetch("/api/list");
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

  return (
    <div>
      <NavBar />
      <main className={`main ${inter.className}`}>
        <div className="flex flex-wrap justify-evenly">
          {KPBagHandles.map((bag, index) => (
            <div
              className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
              key={index}
            >
              <img className="w-72 h-36 object-contain" src="/bolsas-kraft.jpg" alt="Bag Image" />
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
                              <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap text-center">
                                {bag.width}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap text-center">
                                {bag.height}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap text-center">
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
                <p className="text-gray-700 text-lg"> Precio x100: <span className="font-bold">${bag.price.toFixed(2)}</span></p>
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
                <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black">
                  <i className="fas fa-shopping-cart cart-icon text-xl mr-1"></i>
                  <span className="px-2 py-1">Agregar al carrito</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}