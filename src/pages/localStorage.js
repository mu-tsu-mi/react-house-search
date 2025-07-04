const localStorageKey = "houses";

export const load = () => {
  const housesFromLocalStorage = JSON.parse(
    localStorage.getItem(localStorageKey)
  );
  if (!housesFromLocalStorage) {
    return new Map();
  }
  return new Map(housesFromLocalStorage);
};
