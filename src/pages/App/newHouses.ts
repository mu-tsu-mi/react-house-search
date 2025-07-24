import axios from "axios";
import * as cheerio from "cheerio";

// click on the button to enable cors anywhere : https://cors-anywhere.herokuapp.com/corsdemo
export const fetchNewHousesFromDomain = async (urls: string[]) => {
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
      const listingSummary = item.props.pageProps.componentProps.listingSummary;
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
        supermarket: "",
        s32: false,
        importantComments: "",
        comments: "",
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
  return parsedHouses;
};
