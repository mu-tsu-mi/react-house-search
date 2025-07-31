const localStorageKey = "houses";

export const fetchLocalStorageAsMap = () => {
  // check local storage first then parse if there is a house/houses
  const checkLocalStorage = localStorage.getItem(localStorageKey);
  if (!checkLocalStorage) {
    return new Map();
  }
  const housesFromLocalStorage = JSON.parse(checkLocalStorage);
  return new Map(housesFromLocalStorage);
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
};
