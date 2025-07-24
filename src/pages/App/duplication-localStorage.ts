import { House } from "./App";

export const duplicationCheckLocalStorage = (
  arrOfDuplication: House[]
): string => {
  if (arrOfDuplication.length === 0) return "";

  const errorMsgArr: string[] = [];
  arrOfDuplication.forEach((item: House) => {
    errorMsgArr.push(`This house is already in your list: ${item.address}`);
  });
  return errorMsgArr.join();
};
