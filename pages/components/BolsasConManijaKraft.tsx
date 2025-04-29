// Importaciones necesarias
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback } from "react";
import NavBar from '../components/NavBar';
import { useCart } from '../../context/CartContext';
import '../../styles/styles.css';
import { useRouter } from 'next/router';
import { ConnectionStatus, Bag } from "@/utils/types"; // Importar tipos desde el archivo utils/types.ts
import { getServerSidePropsUtil } from "@/utils/getServerSidePropsUtil";
import { useQuantityHandler } from "@/hooks/useQuantityHandler";
import { handleAddToCartUtil } from "@/utils/addToCartUtil";
import { calculateFinalPrice } from "@/utils/calculateFinalPrice";
import QuantityControls from "@/pages/components/QuantityControls";

const inter = Inter({ subsets: ["latin"] });

// Función para obtener datos del servidor
export const getServerSideProps = getServerSidePropsUtil;

// Componente principal
const BolsasConManijaKraft = ({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // Estados y variables
  const [bags, setBags] = useState<Bag[]>([]);
  const { quantities, setQuantities, handleIncrement, handleDecrement, handleQuantityChange } = useQuantityHandler();
  const { addToCart, cart, clearCart } = useCart();
  const [showCartDetails, setShowCartDetails] = useState(false);
  const router = useRouter();
  const folderName = router.pathname.split('/').slice(-2, -1)[0];

  // Efecto para cargar datos de las bolsas
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
      setQuantities(initialQuantities); // Usar setQuantities del hook
    })();
  }, []);

  // Función para agregar productos al carrito
  const handleAddToCart = (systemCode: string, description: string, list2: number) => {
    handleAddToCartUtil(systemCode, description, list2, bags, folderName, quantities, addToCart, setQuantities);
  };

  // Función para calcular el total de ítems en el carrito
  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  // Función para realizar el pedido
  const placeOrder = () => {
    alert('Pedido realizado con éxito!');
    clearCart();
  };

  // Renderizado del componente
  return (
    <div>
      {/* Barra de navegación */}
      <NavBar />
      <main className={`main ${inter.className}`} style={{ marginTop: '4rem'}}>
        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:space-x-4">
          {/* Detalles del carrito */}
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
          {/* Listado de bolsas */}
          <div className="lg:flex-1 order-2 lg:order-1">
            <div className="flex flex-wrap justify-evenly">
              {bags.map((bag, index) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={index}
                >
                  {/* Imagen y descripción */}
                  <img className="w-72 h-36 object-contain" src="/bolsas-kraft.jpg" alt="Bolsa con Manija Kraft" />
                  <div className="container mx-auto p-2">
                    {/* Tabla con descripción */}
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
                  {/* Precio calculado */}
                  <div className="flex justify-center mb-2">
                    <p className="text-gray-700 text-lg"> Precio x100: 
                      <span className="font-bold">
                        {calculateFinalPrice(folderName, bag)}
                      </span>
                    </p>
                  </div>
                  {/* Controles de cantidad y botón de agregar */}
                  <QuantityControls
                    bag={bag}
                    quantities={quantities}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                    handleQuantityChange={handleQuantityChange}
                    setQuantities={setQuantities}
                    handleAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Pie de página */}
      <footer className="text-center bg-[#efefef] py-4">
        <p>{folderName.toUpperCase()}</p>
      </footer>
    </div>
  );
}

export default BolsasConManijaKraft;