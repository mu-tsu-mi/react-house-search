export const duplicationCheckLocalStorage = (arrOfDuplication) => {
  if (arrOfDuplication.length === 0) return;

  const errorMsgArr: string[] = [];
  arrOfDuplication.forEach((item) => {
    errorMsgArr.push(`This house is already in your list: ${item.address}`);
  });
  return errorMsgArr.join();
};
