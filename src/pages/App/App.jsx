import { useState, useEffect } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import "./App.css";
import { domainHouses } from "../../domain-houses";
import HouseCard from "../../components/HouseCard/HouseCard";
// const jmespath = require('jmespath');
// import { houses } from '../../houses.js';

const urls = [
  "https://www.domain.com.au/1-2-hudson-street-coburg-vic-3058-2019983759",
  // "https://www.domain.com.au/4-6-hudson-street-coburg-vic-3058-2019260956",
  // "https://www.domain.com.au/6-47-railway-place-west-flemington-vic-3031-2019990953",
  // "https://www.domain.com.au/3-7-9-rankins-road-kensington-vic-3031-2019933401",
  // "https://www.domain.com.au/3-85-tinning-street-brunswick-vic-3056-2019675167",
  // "https://www.domain.com.au/516-300-victoria-street-brunswick-vic-3056-2019304279",
  // "https://www.domain.com.au/16-5-industry-lane-coburg-vic-3058-2019962199",
];

export default function App() {
  const [listOfHouses, setListOfHouses] = useState([]);
  const [getNew, setGetNew] = useState(false);
  const [newUrls, setNewUrls] = useState(["", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLocalStorage = () => {
    const housesStoredInLocalStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("house-")) {
        const house = localStorage.getItem(key);
        if (house) {
          housesStoredInLocalStorage.push(JSON.parse(house));
        }
      }
    }
    return housesStoredInLocalStorage;
  };

  // Load from local storage
  useEffect(() => {
    if (getNew) return;

    const housesStoredInLocalStorage = fetchLocalStorage();
    console.log("local storage: ", housesStoredInLocalStorage);
    if (housesStoredInLocalStorage.length > 0) {
      setListOfHouses(housesStoredInLocalStorage);
    }
  }, [getNew]);

  // Load from Domain or domainHouses in domain-houses.js
  useEffect(() => {
    if (!getNew) return;

    const getHouses = async () => {
      // click on the button : https://cors-anywhere.herokuapp.com/corsdemo
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";

      const responses = await Promise.all(
        urls.map((url) => axios.get(proxyUrl + url))
      );
      const dataArray = responses.map((res) => res.data);

      const houseData = dataArray.map((html) => {
        const $ = cheerio.load(html);
        const housesFromTag = $("script[id='__NEXT_DATA__']").text();
        return housesFromTag;
      });

      // const houseData = domainHouses;
      const parsedHouses = houseData
        // .map((house) => {
        .map((house) => JSON.parse(house))
        .map((item) => {
          console.log("domain props: ", item.props.pageProps.componentProps);
          const listingSummary =
            item.props.pageProps.componentProps.listingSummary;
          const rootGraphQuery =
            item.props.pageProps.componentProps.rootGraphQuery.listingByIdV2;
          const inspection = item.props.pageProps.componentProps.inspection;
          const suburb = item.props.pageProps.componentProps.suburb;
          const listingId = item.props.pageProps.componentProps.listingId;

          // temporary houses data to reduce request
          // const listingSummary = house.listingSummary;
          // const rootGraphQuery = house.rootGraphQuery.listingByIdV2;
          // const inspection = house.inspection;
          // const suburb = house.suburb;
          // const listingId = house.listingId;
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

      console.log(parsedHouses);

      setListOfHouses(parsedHouses);

      const newHouses = parsedHouses.filter((parsedH) => {
        const housesStoredInLocalStorage = fetchLocalStorage();
        if (!housesStoredInLocalStorage) {
          return;
        } else {
          return !housesStoredInLocalStorage.some((storedH) => {
            return parsedH.id === storedH.id;
          });
        }
      });

      if (newHouses.length === 0) {
        return;
      } else {
        newHouses.forEach((newH) =>
          localStorage.setItem(`house-${newH.id}`, JSON.stringify(newH))
        );
      }
      // Set status back after saving new houses
      setGetNew(false);
    };

    getHouses();
  }, [getNew]);

  const handleAddUrls = (e) => {
    // Add new urls after checking for duplication
    e.preventDefault();
    setErrorMsg("");
    const domainUrl = "domain.com.au";
    if (newUrls.length === 0) {
      setErrorMsg("Enter at least one URL");
      return;
    }

    // filter domain URLs only
    const validUrls = newUrls.filter((url) => url.includes(domainUrl));
    const invalidUrls = newUrls
      .filter((url) => !url.includes(domainUrl))
      .filter((url) => url !== "");
    // console.log(
    //   validUrls,
    //   validUrls.length,
    //   invalidUrls.length,
    //   invalidUrls,
    //   newUrls.length
    // );
    const duplicationCheck = new Set(validUrls);
    const noDuplication = duplicationCheck.size === validUrls.length;

    // const allValid = newUrls.every((url) => url.includes(domainUrl));

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
    // console.log("is it here?");
    setGetNew(true);
    setNewUrls(["", "", ""]);
  };

  const onSaveNotes = (house, notes) => {
    // local storage
    const updatedHouse = {
      ...house,
      userNotes: { ...house.userNotes, ...notes },
    };
    localStorage.setItem(`house-${house.id}`, JSON.stringify(updatedHouse));
  };

  const handleUrlInput = (index, value) => {
    const updated = [...newUrls];
    updated[index] = value;
    setNewUrls(updated);
  };

  return (
    <div className="App">
      {/* Move urls form to a component */}
      <form type="submit" className="urls-to-add">
        <input
          type="url"
          placeholder="Add URL"
          value={newUrls[0]}
          pattern=".*\.domain\.com\.au.*"
          onChange={(e) => handleUrlInput(0, e.target.value)}
          className="url"
          required
        />
        <input
          type="url"
          placeholder="Add URL"
          value={newUrls[1]}
          pattern=".*\.domain\.com\.au.*"
          onChange={(e) => handleUrlInput(1, e.target.value)}
          className="url"
        />
        <input
          type="url"
          placeholder="Add URL"
          value={newUrls[2]}
          pattern=".*\.domain\.com\.au.*"
          onChange={(e) => handleUrlInput(2, e.target.value)}
          className="url"
        />
        <button type="submit" id="get-house-button" onClick={handleAddUrls}>
          Get more houses
        </button>
        {errorMsg && <div>{errorMsg}</div>}
      </form>
      <div className="house-list">
        {listOfHouses.map((house) => (
          <HouseCard
            house={house}
            key={house.id}
            onSaveNotes={(notes) => onSaveNotes(house, notes)}
          />
        ))}
      </div>
    </div>
  );
}
