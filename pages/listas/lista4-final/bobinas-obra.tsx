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
  additionalDescription: string;
  description: string;
  list4: number;
  systemCode: string; 
};

export default function BolsasConManijaKraft({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [bags, setBags] = useState<Bag[]>([]);
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/allPrices");
        const data = await response.json();
        const processedData = data.boObr
          .map((bag: Bag) => ({
            ...bag,
            description: bag.description.replace(/^Bolsa Fast Food\s*/, "").replace(/\s*x\s*100\s*u\.?$/, "").replace("Fantasia", ""),
          }))
          .sort((a: Bag, b: Bag) => order.indexOf(a.systemCode) - order.indexOf(b.systemCode));
        setBags(processedData);
      } catch (error) {
        console.error("Error fetching bag handles:", error);
      }
    })();
  }, []);

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = useCallback(() => {
    alert('Pedido realizado con éxito!');
    clearCart();
  }, [clearCart]);

  const order = ["multicírculos rojo", "multicírculos naranja", "multicírculos verde", "multicírculos negro", "tejido rojo", "tejido naranja", "tejido verde", "tejido negro", "zigzag rojo", "zigzag naranja", "zigzag verde", "zigzag negro", "delivery negro", "delivery gris", "delivery marrón", "Pintita negro", "Pintita Naranja", "Pintita Verde", "Pintita Rojo", "regalos negro", "regalos naranja", "regalos verde", "regalos rojo", "animalitos naranja", "animalitos verde", "animalitos rojo", "Navidad Azul", "Navidad Verde", "Navidad Rojo"];

  const groupedBags = bags.reduce((acc: { [key: string]: Bag[] }, bag: Bag) => {
    if (!acc[bag.additionalDescription]) {
      acc[bag.additionalDescription] = [];
    }
    acc[bag.additionalDescription].push(bag);
    return acc;
  }, {});

  const sortedGroupedBags = Object.keys(groupedBags)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .reduce((acc: { [key: string]: Bag[] }, key: string) => {
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
            <div className="flex flex-wrap justify-evenly">
              {Object.entries(sortedGroupedBags).map(([additionalDescription, bags]) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={additionalDescription}
                >
                  <img className="w-72 h-36 object-contain" src={`/Bobina Obra ${additionalDescription}.png`} alt={additionalDescription} />
                  <div className="px-4 py-1 ">
                    <BagCard bags={bags} additionalDescription={additionalDescription} addToCart={addToCart} />
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

type BagCardProps = {
  bags: Bag[];
  additionalDescription: string;
  addToCart: (systemCode: string, quantity: number, description: string, price: number) => void;
};

const BagCard: React.FC<BagCardProps> = ({ bags, additionalDescription, addToCart }) => {
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
    bags.forEach((bag, index) => {
      if (quantities[index] > 0) {
        addToCart(bag.systemCode, quantities[index], ` ${bag.description}  ${additionalDescription}`, bag.list4);
      }
    });
    setQuantities(bags.map(() => 0));
  };

  // Sort bags so that descriptions with "37 cm" appear first
  const sortedBags = bags.sort((a, b) => {
    if (a.description.includes("37 cm") && !b.description.includes("37 cm")) {
      return -1;
    }
    if (!a.description.includes("37 cm") && b.description.includes("37 cm")) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {sortedBags.map((bag, index) => (
        <div key={bag.systemCode}>
          <div className="flex justify-center mb-2">
            <p className="text-gray-700 text-base mt-2">{bag.description.replace("Fantasia", "")} - {bag.additionalDescription}</p>
          </div>
          <div className="w-full bg-gray-200 p-1 rounded-lg mb-2">
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
          <div className="flex justify-center mb-2">
            <p className="text-gray-700 text-lg"> Precio x und. : <span className="font-bold">${Math.round(bag.list4)}</span></p>
          </div>
        </div>
      ))}
      <div className="w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer" onClick={handleAddToCart}>
        <i className="fas fa-shopping-cart cart-icon text-xl mr-1"></i>
        <span className="px-2 py-1">Agregar al carrito</span>
      </div>
    </div>
  );
};