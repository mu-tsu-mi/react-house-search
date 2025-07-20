const localStorageKey = "houses";

export const fetchLocalStorageAsMap = () => {
  const housesFromLocalStorage = JSON.parse(
    localStorage.getItem(localStorageKey) ?? ""
  );
  if (!housesFromLocalStorage) {
    return new Map();
  }
  return new Map(housesFromLocalStorage);
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
};
