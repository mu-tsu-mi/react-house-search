import {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import DomainScraperUrlForm from "../../components/DomainScraperUrlForm/DomainScraperUrlForm";
import HouseCard from "../../components/HouseCard/HouseCard";
import "./App.css";
import { duplicationCheckLocalStorage } from "./duplication-localStorage";
import { fetchLocalStorageAsMap, saveToLocalStorage } from "./localStorage";
import { fetchNewHousesFromDomain } from "./newHouses";
import { validateNewUrls } from "./urlCheck";

const urls: string[] = [];

export interface House {
  id: number;
  url: string;
  address: string;
  suburb: string;
  baths: number;
  beds: number;
  parking: number;
  saleType: string;
  propertyType: string;
  lowestPrice: number;
  highestPrice: number;
  singlePrice: number | null;
  propertyPhoto: string;
  privateInspectionBoolean: boolean;
  inspectionSchedule: InspectionSchedule[];
  userNotes: UserNotes;
}

export type InspectionSchedule = {
  dayOfWeek: string;
  day: string;
  month: string;
  id: string;
  openingDateTime: string;
  time: string;
};

interface UserNotes {
  balcony: string;
  comments: string;
  importantComments: string;
  s32: boolean;
  supermarket: string;
  train: string;
  tram: string;
}

export default function App() {
  const [listOfHouses, setListOfHouses] = useState<Map<number, House>>(
    new Map()
  );
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
    setErrorMsg("");

    const getHouses = async () => {
      const parsedHouses = await fetchNewHousesFromDomain(urls);
      // cleans out previous urls (so that previous ones won't show up in error msg)
      urls.length = 0;

      // check duplication compared with the houses in local storage
      const alreadyInLocalStorage: House[] = parsedHouses.filter((parsedH) =>
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

  const handleAddUrls = (e: FormEvent<HTMLFormElement>) => {
    // Add new urls after checking for duplication
    e.preventDefault();
    setErrorMsg("");

    if (newUrl.length === 0) {
      setErrorMsg("Enter a URL");
      return;
    }

    const { invalidUrls, hasDuplication, validUrls } = validateNewUrls(newUrl);
    if (hasDuplication) {
      setErrorMsg("Please resubmit URLs without duplication");
      return;
    }
    // urls contain invalid url
    if (invalidUrls.length > 0) {
      setErrorMsg("URL must be a Domain property page");
      return;
    }
    validUrls.forEach((newUrl) => urls.push(newUrl));

    getHouseFromDomain();
    setNewUrl("");
  };

  const onSaveNotes = (house: House, notes: House["userNotes"]) => {
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

  const handleDeleteHouse = (id: number) => {
    /* Delete the house from the Map, update state(Use updatedMap to avoid using old state accidentally) 
    then save the change in local storage. */
    listOfHouses.delete(id);
    const updatedMap = new Map(listOfHouses);
    setListOfHouses(updatedMap);
    saveStateToLocalStorage();
  };

  const handleUrlInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUrl(e.target.value);
    setErrorMsg("");
  };

  return (
    <div className="App">
      <DomainScraperUrlForm
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
            onSaveNotes={(notes: House["userNotes"]) =>
              onSaveNotes(house, notes)
            }
            handleDeleteHouse={handleDeleteHouse}
          />
        ))}
      </div>
    </div>
  );
}
