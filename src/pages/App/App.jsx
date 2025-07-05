import { useState, useEffect, useCallback } from "react";
import "./App.css";
import UrlForm from "../../components/UrlForm/UrlForm";
import HouseCard from "../../components/HouseCard/HouseCard";
import { fetchLocalStorageAsMap, saveToLocalStorage } from "./localStorage";
import { validateNewUrls } from "./urlCheck";
import { fetchNewHousesFromDomain } from "./newHouses";
import { duplicationCheckLocalStorage } from "./duplication-localStorage";

const urls = [];

export default function App() {
  const [listOfHouses, setListOfHouses] = useState(new Map());
  const [newUrl, setNewUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load from local storage
  const loadFromLocalStorage = useCallback(() => {
    const housesStoredInLocalStorage = fetchLocalStorageAsMap();
    setListOfHouses(housesStoredInLocalStorage);
  }, []);

  // Save to local storage
  const saveStateToLocalStorage = useCallback(() => {
    const arr = Array.from(listOfHouses.entries());
    //TODO: can I use [...]?
    saveToLocalStorage(arr);
  }, [listOfHouses]);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Load from Domain
  const getHouseFromDomain = useCallback(() => {
    const getHouses = async () => {
      const parsedHouses = await fetchNewHousesFromDomain(urls);

      // check duplication compared with the houses in local storage
      const alreadyInLocalStorage = parsedHouses.filter((parsedH) =>
        listOfHouses.get(parsedH.id)
      );
      const msgDuplicationLS = duplicationCheckLocalStorage(
        alreadyInLocalStorage
      );
      setErrorMsg(msgDuplicationLS);

      const newHouses = parsedHouses.filter((parsedH) => {
        return !listOfHouses.get(parsedH.id);
      });

      if (newHouses.length === 0) {
        return;
      } else {
        // since it is Map, use .set: This does not update React state(updating the existing Map)
        newHouses.forEach((house) => {
          listOfHouses.set(house.id, house);
        });
        saveStateToLocalStorage();
      }
      // to update State, use setter. I need new Map() for React to notice Map is updated.
      setListOfHouses(new Map(listOfHouses));
    };

    getHouses();
  }, [listOfHouses, saveStateToLocalStorage]);

  const handleAddUrls = (e) => {
    // Add new urls after checking for duplication
    e.preventDefault();
    setErrorMsg("");

    if (newUrl.length === 0) {
      setErrorMsg("Enter a URL");
      return;
    }

    const { invalidUrls, noDuplication, validUrls } = validateNewUrls(newUrl);
    if (!noDuplication) {
      setErrorMsg("Please resubmit URLs without duplication");
      return;
    }
    // urls contain invalid url
    if (invalidUrls.length > 0) {
      setErrorMsg("URL must be a Domain property page");
      return;
    }
    if (noDuplication) {
      validUrls.forEach((newUrl) => urls.push(newUrl));
    }

    getHouseFromDomain();
    setNewUrl("");
  };

  const onSaveNotes = (house, notes) => {
    // local storage
    const updatedHouse = {
      ...house,
      userNotes: { ...house.userNotes, ...notes },
    };
    //localStorage.setItem(`house-${house.id}`, JSON.stringify(updatedHouse));
    listOfHouses.set(updatedHouse.id, updatedHouse);
    // change state reference by new Map() for React
    setListOfHouses(new Map(listOfHouses));
    saveStateToLocalStorage();
  };

  const handleDeleteHouse = (id) => {
    /* Delete the house from the Map, update state(Use updatedMap to avoid using old state accidentally) 
    then save the change in local storage. */
    listOfHouses.delete(id);
    const updatedMap = new Map(listOfHouses);
    setListOfHouses(updatedMap);
    saveStateToLocalStorage();
  };

  const handleUrlInput = (e) => {
    setNewUrl(e.target.value);
  };

  return (
    <div className="App">
      <UrlForm
        newUrl={newUrl}
        handleUrlInput={handleUrlInput}
        handleAddUrls={handleAddUrls}
        errorMsg={errorMsg}
      />
      <div className="house-list">
        {Array.from(listOfHouses.values()).map((house) => (
          <HouseCard
            house={house}
            key={house.id}
            onSaveNotes={(notes) => onSaveNotes(house, notes)}
            handleDeleteHouse={handleDeleteHouse}
          />
        ))}
      </div>
    </div>
  );
}
