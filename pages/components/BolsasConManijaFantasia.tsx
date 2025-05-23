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
import { ConnectionStatus, Bag } from "@/utils/types"; // Importar tipos desde el archivo utils/types.ts
import { getServerSidePropsUtil } from "@/utils/getServerSidePropsUtil";
import { useQuantityHandler } from "@/hooks/useQuantityHandler";
import { handleAddToCartUtil } from "@/utils/addToCartUtil";
import { calculateFinalPrice } from "@/utils/calculateFinalPrice";
import QuantityControls from "@/pages/components/QuantityControls";
import Loading from "@/pages/components/Loading"; // importar Loading

const inter = Inter({ subsets: ["latin"] });

// Función para obtener datos del servidor
export const getServerSideProps = getServerSidePropsUtil;

const BolsasConManijaFantasia = ({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true); // estado loading
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);
  const router = useRouter();
  const folderName: keyof Bag | 'lista2' | 'lista2-10' | 'lista2-10-2' | 'lista2-final' | 'lista2-10-final' | 'lista2-10-2-final' | 'lista3-10' | 'lista3-10-2' | 'lista3-final' | 'lista3-10-final' | 'lista3-10-2-final' | 'lista4-10' | 'lista4-10-2' | 'lista4-final' | 'lista4-10-final' | 'lista4-10-2-final' = router.pathname.split('/').slice(-2, -1)[0] as any;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); // inicia loading
        const response = await fetch("/api/allPrices");
        const data = await response.json();
        const order = ["BG1P001", "BG1P002", "BG1P003", "BG1P004", "BG1P00S", "BG3P001", "BG3P002", "BG3P003", "BG3P004", "BG3P00S", "BG5P001", "BG5P002", "BG5P003", "BG5P004", "BG5P00S"];
        const processedData = data.boFae
          .map((bag: Bag) => ({
            ...bag,
            description: bag.description.slice(6, 9),
          }))
          .sort((a: Bag, b: Bag) => order.indexOf(a.systemCode) - order.indexOf(b.systemCode));
        setBags(processedData);
      } catch (error) {
        console.error("Error fetching bag handles:", error);
      } finally {
        setLoading(false); // termina loading
      }
    })();
  }, []);

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
    const order = ["G1", "G3", "G5"];
    acc[key] = groupedBags[key].sort((a, b) => {
      const aPrefix = a.description.slice(0, 2);
      const bPrefix = b.description.slice(0, 2);
      const aIndex = order.indexOf(aPrefix);
      const bIndex = order.indexOf(bPrefix);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else {
        return aPrefix.localeCompare(bPrefix);
      }
    });
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
                {Object.entries(cart).map(([uniqueKey, item]) => (
                  <li key={uniqueKey} className="flex justify-between py-2">
                    <span>{item.product}</span>
                    <span>{item.quantity}</span>
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
            {loading ? (
              <Loading />
            ) : (
              <div className="flex flex-wrap justify-evenly">
                {Object.entries(sortedGroupedBags).map(([additionalDescription, bags]) => (
                  <div
                    className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                    key={additionalDescription}
                  >
                    <img className="w-72 h-36 object-contain" src={`/Bolsa Fantasia ${additionalDescription}.png`} alt={additionalDescription} />
                    <div className="px-4 py-1 ">
                      <BagCard bags={bags.slice(0, 3)} additionalDescription={additionalDescription} addToCart={addToCart} folderName={folderName}  />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center bg-[#efefef] py-4">
        <p>{folderName.toUpperCase()}</p>
      </footer>
    </div>
  );
}

type BagCardProps = {
  bags: Bag[];
  additionalDescription: string;
  addToCart: (systemCode: string, quantity: number, description: string, price: number) => void;
};

const BagCard: React.FC<BagCardProps & {folderName: string }> = ({ bags, additionalDescription, addToCart, folderName}) => {
  const [quantities, setQuantities] = useState<number[]>(bags.map(() => 0));

  const handleIncrement = (index: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const handleDecrement = (index: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = Math.max(newQuantities[index] - 1, 0);
      return newQuantities;
    });
  };

  const handleQuantityChange = (index: number, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => {
        const newQuantities = [...prevQuantities];
        newQuantities[index] = numberValue;
        return newQuantities;
      });
    }
  };

  const handleAddToCart = () => {
    const quantitiesObject = bags.reduce((acc, bag, index) => {
      acc[bag.systemCode] = quantities[index];
      return acc;
    }, {} as { [key: string]: number });

    bags.forEach((bag, index) => {
      if (quantities[index] > 0) {
        handleAddToCartUtil(
          bag.systemCode,
          `G${bag.description}`,
          bag.list2,
          bags,
          folderName,
          quantitiesObject,
          addToCart,
          () => setQuantities(bags.map(() => 0)) // Reset quantities correctly
        );
      }
    });
    setQuantities(bags.map(() => 0));
  };


  return (
    <div>
      {bags.map((bag, index) => (
        <div key={bag.systemCode}>
          <div className="flex justify-center mb-2">
            <p className="text-gray-700 text-base mt-2">{bag.description} - Precio x100:   
              <span className="font-bold">
                  {calculateFinalPrice(folderName, bag)}
              </span>
            </p>
          </div>
          <div className="w-full bg-gray-200 p-1 rounded-lg">
            <div className="flex items-center justify-between">
              <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(index)}>-</button>
              <input
                type="number"
                className="w-16 text-center bg-gray-200 no-arrows text-black"
                value={quantities[index]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleQuantityChange(index, '0');
                  } else {
                    handleQuantityChange(index, value);
                  }
                }}
                onFocus={(e) => e.target.select()}
              />
              <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(index)}>+</button>
            </div>
          </div>
        </div>
      ))}
         <AddToCartButton
        systemCode={bags[0].systemCode}
        description={` ${bags[0].description} ${additionalDescription}`}
        list4={bags[0].list4}
        list3={bags[0].list3}
        list2={bags[0].list2}
        quantity={quantities.reduce((acc, qty) => acc + qty, 0)}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};


export default BolsasConManijaFantasia;