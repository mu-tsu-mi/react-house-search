import { useState, useEffect } from "react"
import axios from 'axios'
import * as cheerio from 'cheerio';
import './App.css';
import HouseCard from '../../components/HouseCard/HouseCard';
// import { houses } from '../../houses.js';

const urls = [
  "https://www.domain.com.au/1-2-hudson-street-coburg-vic-3058-2019983759",
  "https://www.domain.com.au/4-6-hudson-street-coburg-vic-3058-2019260956",
  // "https://www.domain.com.au/6-47-railway-place-west-flemington-vic-3031-2019990953",
  // "https://www.domain.com.au/3-7-9-rankins-road-kensington-vic-3031-2019933401",
  // "https://www.domain.com.au/3-85-tinning-street-brunswick-vic-3056-2019675167",
  // "https://www.domain.com.au/516-300-victoria-street-brunswick-vic-3056-2019304279",
  // "https://www.domain.com.au/16-5-industry-lane-coburg-vic-3058-2019962199",
]

export default function App() {
const [ listOfHouses, setListOfHouses ] = useState([]);

useEffect(() => {
    const getHouses = async () => {
      // click on the button : https://cors-anywhere.herokuapp.com/corsdemo
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const responses = await Promise.all(
          urls.map((url) => axios.get(proxyUrl + url))
        );
        const dataArray = responses.map(res => res.data);

        const houseData = dataArray.map((html) => {
          const $ = cheerio.load(html);
          const housesFromTag = $("script[id='__NEXT_DATA__']").text();
          // console.log('housesFromTag',housesFromTag)
          return housesFromTag
        })

        const parsedHouses = houseData.map((house) => JSON.parse(house))
        
        // const $ = cheerio.load(data);
        
        console.log(parsedHouses)
        const houses = setListOfHouses(parsedHouses)
        console.log('houses: ',houses)
    }

    getHouses()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <div className="house-list">
          {/* { houses.map((house) => <HouseCard house={house} key={house.id} /> )} */}
        </div>
      </header>
    </div>
  );
}
