import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import "./App.css";
import HouseCard from "../../components/HouseCard/HouseCard";
import { fetchLocalStorageAsMap, saveToLocalStorage } from "./localStorage";
import { validateNewUrls } from "./urlCheck";

const urls = [];

// const localStorageKey = "houses";

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
  const getHouseFromDomainOrLocal = useCallback(() => {
    const getHouses = async () => {
      // Get new houses from Domain via backend
      // const getNewHouses = async () => {
      //   const responses = await Promise.all(
      //     urls.map((url) => {
      //       return axios.get("/api/house", {
      //         params: { url },
      //       });
      //     })
      //   );
      //   const backend = responses.map((res) => res.data);
      //   console.log("backend", backend);
      //   return backend;
      // };
      // const responses = getNewHouses();

      // click on the button to enable cors anywhere : https://cors-anywhere.herokuapp.com/corsdemo
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";

      const responses = await Promise.all(
        urls.map((url) => axios.get(proxyUrl + url))
      );
      const dataArray = responses.map((res) => res.data);

      const houseData = dataArray.map((html) => {
        const $ = cheerio.load(html);
        // data in JSON
        const housesFromTag = $("script[id='__NEXT_DATA__']").text();
        return housesFromTag;
      });

      const parsedHouses = houseData
        .map((house) => JSON.parse(house))
        .map((item) => {
          const listingSummary =
            item.props.pageProps.componentProps.listingSummary;
          const rootGraphQuery =
            item.props.pageProps.componentProps.rootGraphQuery.listingByIdV2;
          const inspection = item.props.pageProps.componentProps.inspection;
          const suburb = item.props.pageProps.componentProps.suburb;
          const listingId = item.props.pageProps.componentProps.listingId;
          const listingUrl = item.props.pageProps.componentProps.listingUrl;

          const userNotes = {
            tram: "",
            train: "",
            balcony: "",
            supermarket: [],
            s32: false,
            importantComments: [],
            comments: [],
            preference: null,
          };
          return {
            id: listingId,
            url: listingUrl,
            address: listingSummary.address,
            suburb: suburb,
            baths: listingSummary.baths,
            beds: listingSummary.beds,
            parking: listingSummary.parking,
            saleType: rootGraphQuery.saleMethod,
            propertyType: rootGraphQuery.propertyTypes[0],
            lowestPrice: rootGraphQuery.priceDetails.rawValues.from,
            highestPrice: rootGraphQuery.priceDetails.rawValues.to,
            singlePrice: rootGraphQuery.priceDetails.rawValues.exactPriceV2,
            propertyPhoto: rootGraphQuery.smallMedia[0].url,
            privateInspectionBoolean: inspection.appointmentOnly,
            // array .openingDateTime, .closingDateTime and .time
            inspectionSchedule: inspection.inspectionTimes,
            userNotes: userNotes,
          };
        });

      // check duplication compared with the houses in local storage
      const alreadyInLocalStorage = parsedHouses.filter((parsedH) =>
        listOfHouses.get(parsedH.id)
      );
      if (alreadyInLocalStorage.length > 0) {
        let errorMsgArr = [];
        for (let i = 0; i < alreadyInLocalStorage.length; i++) {
          errorMsgArr.push(
            `This house is already in your list: ${alreadyInLocalStorage[i].id}`
          );
        }
        setErrorMsg(errorMsgArr.join());
      }

      const newHouses = parsedHouses.filter((parsedH) => {
        return !listOfHouses.get(parsedH.id);
      });

      if (newHouses.length === 0) {
        return;
      } else {
        // since it is Map, use .set: This does not update React state
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

    getHouseFromDomainOrLocal();
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
      <form type="submit" className="urls-to-add">
        <input
          type="url"
          placeholder="Add URL"
          value={newUrl}
          pattern=".*\.domain\.com\.au.*"
          onChange={handleUrlInput}
          className="url"
          required
        />
        <button type="submit" id="get-house-button" onClick={handleAddUrls}>
          Get a new house
        </button>
        <div>{errorMsg}</div>
      </form>
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
