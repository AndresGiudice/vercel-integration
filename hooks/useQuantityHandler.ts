import { useState } from "react";

  // Funciones para manejar cantidades
export const useQuantityHandler = (initialQuantities: { [key: string]: number } = {}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(initialQuantities);

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

  return {
    quantities,
    setQuantities,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
  };
};