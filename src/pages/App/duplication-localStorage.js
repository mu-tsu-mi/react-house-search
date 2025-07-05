export const duplicationCheckLocalStorage = (arrOfDuplication) => {
  if (arrOfDuplication.length > 0) {
    let errorMsgArr = [];
    for (let i = 0; i < arrOfDuplication.length; i++) {
      errorMsgArr.push(
        `This house is already in your list: ${arrOfDuplication[i].address}`
      );
    }
    return errorMsgArr.join();
  }
};
