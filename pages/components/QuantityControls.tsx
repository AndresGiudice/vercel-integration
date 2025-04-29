import React from "react";
import AddToCartButton from "@/pages/components/AddToCartButton";
import { Bag } from "@/utils/types";

interface QuantityControlsProps {
  bag?: Bag; // Make bag optional to handle undefined cases
  quantities: { [key: string]: number };
  handleIncrement: (systemCode: string) => void;
  handleDecrement: (systemCode: string) => void;
  handleQuantityChange: (systemCode: string, value: string) => void;
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  handleAddToCart: (systemCode: string, description: string) => void;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  bag,
  quantities,
  handleIncrement,
  handleDecrement,
  handleQuantityChange,
  setQuantities,
  handleAddToCart,
}) => {
  if (!bag) {
    return null; // Return null if bag is undefined
  }

  return (
    <div className="px-4 py-1 ">
      <div className="w-full bg-gray-200 p-1 rounded-lg">
        <div className="flex items-center justify-between">
          <button
            className="px-8 py-1 rounded-l text-black"
            onClick={() => handleDecrement(bag.systemCode)}
          >
            -
          </button>
          <input
            type="number"
            className="w-16 text-center bg-gray-200 no-arrows text-black"
            value={quantities[bag.systemCode] || 0} // Default to 0 if undefined
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
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
          <button
            className="px-8 py-1 rounded-r text-black"
            onClick={() => handleIncrement(bag.systemCode)}
          >
            +
          </button>
        </div>
      </div>
      <AddToCartButton
        systemCode={bag.systemCode}
        description={bag.description}
        list2={bag.list2}
        list3={bag.list3}
        list4={bag.list4}
        quantity={quantities[bag.systemCode] || 0} // Default to 0 if undefined
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default QuantityControls;