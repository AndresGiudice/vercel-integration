import { Bag } from "@/utils/types";

export const handleAddToCartUtil = (
  systemCode: string,
  description: string,
  list2: number,
  bags: Bag[],
  folderName: string,
  quantities: { [key: string]: number },
  addToCart: (systemCode: string, quantity: number, description: string, price: number) => void,
  setQuantities: (quantities: { [key: string]: number } | ((prevQuantities: { [key: string]: number }) => { [key: string]: number })) => void
) => {
  const bag = bags.find((bag) => bag.systemCode === systemCode);
  if (bag) {
    let price = bag.list2; // Default to list2
    if (
      folderName === "lista2-10" ||
      folderName === "lista2-10-2" ||
      folderName === "lista2-final" ||
      folderName === "lista2-10-final" ||
      folderName === "lista2-10-2-final"
    ) {
      price = bag.list2;
    } else if (
      folderName === "lista3" ||
      folderName === "lista3-10" ||
      folderName === "lista3-10-2" ||
      folderName === "lista3-final" ||
      folderName === "lista3-10-final" ||
      folderName === "lista3-10-2-final"
    ) {
      price = bag.list3;
    } else if (
      folderName === "lista4" ||
      folderName === "lista4-10" ||
      folderName === "lista4-10-2" ||
      folderName === "lista4-final" ||
      folderName === "lista4-10-final" ||
      folderName === "lista4-10-2-final"
    ) {
      price = bag.list4;
    }
    addToCart(systemCode, quantities[systemCode], bag.description, price);
    setQuantities((prevQuantities: { [key: string]: number }) => ({
      ...prevQuantities,
      [systemCode]: 0,
    }));
  }
};