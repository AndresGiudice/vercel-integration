import React from 'react';

type AddToCartButtonProps = {
  systemCode: string;
  description: string;
  list4: number;
  list3: number;
  quantity: number;
  handleAddToCart: (systemCode: string, description: string, list4: number, list3: number) => void;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ systemCode, description, list4, list3, quantity, handleAddToCart }) => {
  return (
    <div
      className={`w-full bg-[#A6CE39] p-1 rounded-lg mt-2 flex items-center justify-center text-black cursor-pointer hover:bg-[#84B029] active:bg-[#84B029] active:shadow-inner active:translate-y-1 ${quantity === 0 ? 'cursor-not-allowed' : ''}`} 
      onClick={() => {
        if (quantity > 0) {
          handleAddToCart(systemCode, description, list4, list3);
        }
      }}
    >
      <i className="fas fa-shopping-cart cart-icon text-xl mr-1"></i>
      <span className="px-2 py-1">Agregar al carrito</span>
    </div>
  );
};

export default AddToCartButton;
