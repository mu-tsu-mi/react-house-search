// import { useState, useEffect } from "react"
// import axios from 'axios'
// import * as cheerio from 'cheerio';
import './App.css';
import HouseCard from '../../components/HouseCard/HouseCard';
import { houses } from '../../houses.js';

// const url = "https://www.realestate.com.au/property-townhouse-vic-north+melbourne-147918600"

export default function App() {
  
// useEffect(() => {
//     const getHouse = async () => {
//         const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//         const { data } = await axios.get(proxyUrl + url);

//         const $ = cheerio.load(data);
//         const label = $('.property-info__property-attributes ul').ariaLabel
//         console.log("Label", label)
//     }

//     getHouse()
//   },[])

  return (
    <div className="App">
      <header className="App-header">
        <div className="house-list">
          { houses.map((house) => <HouseCard house={house} key={house.id} /> )}
        </div>
      </header>
    </div>
  );
}
