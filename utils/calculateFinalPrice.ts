import { Bag } from "@/utils/types";

export const calculateFinalPrice = (folderName: string, bag: Bag): string => {
  let finalPrice = 0;

  if (folderName === "lista2") {
    finalPrice = bag.list2 / 1.105;
  } else if (folderName === "lista2-10") {
    finalPrice = (bag.list2 * 0.9) / 1.105;
  } else if (folderName === "lista2-10-2") {
    finalPrice = (bag.list2 * 0.8802) / 1.105;
  } else if (folderName === "lista2-final") {
    finalPrice = bag.list2;
  } else if (folderName === "lista2-10-final") {
    finalPrice = bag.list2 * 0.9;
  } else if (folderName === "lista2-10-2-final") {
    finalPrice = bag.list2 * 0.8802;
  } else if (folderName === "lista3") {
    finalPrice = bag.list3 / 1.105;
  } else if (folderName === "lista3-10") {
    finalPrice = (bag.list3 * 0.9) / 1.105;
  } else if (folderName === "lista3-10-2") {
    finalPrice = (bag.list3 * 0.8802) / 1.105;
  } else if (folderName === "lista3-final") {
    finalPrice = bag.list3;
  } else if (folderName === "lista3-10-final") {
    finalPrice = bag.list3 * 0.9;
  } else if (folderName === "lista3-10-2-final") {
    finalPrice = bag.list3 * 0.8802;
  } else if (folderName === "lista4") {
    finalPrice = bag.list4 / 1.105;
  } else if (folderName === "lista4-10") {
    finalPrice = (bag.list4 * 0.9) / 1.105;
  } else if (folderName === "lista4-10-2") {
    finalPrice = (bag.list4 * 0.8802) / 1.105;
  } else if (folderName === "lista4-final") {
    finalPrice = bag.list4;
  } else if (folderName === "lista4-10-final") {
    finalPrice = bag.list4 * 0.9;
  } else if (folderName === "lista4-10-2-final") {
    finalPrice = bag.list4 * 0.8802;
  }

  return `$${Math.round(finalPrice)}`;
};