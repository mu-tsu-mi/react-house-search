import { useState } from 'react';
import './UserNotes.css';

export default function UserNotes() {
    const [input, setInput] = useState({});

    return(
        <>
            <div>
                <img src="/images/tram.png" alt="tram" className="usernote-icons" />
                <input name="tram-input" type="text" maxlength="30" placeholder="Travel time, tram#" />
                <img src="/images/train.png" alt="train" className="usernote-icons" />
                <input name="train-input" type="text" maxlength="30" placeholder="Travel time, station, railway" />
                <img src="/images/sun.png" alt="sun" className="usernote-icons" />
                <span>-balcony: </span>
                <input name="sun-input" type="text" maxlength="50" placeholder="North-facing..." />
                <img src="/images/shopping-cart.png" alt="supermarket" className="usernote-icons" />
                <input name="grocery-shopping-input" type="text" maxlength="80" placeholder="Supermarket, travel time" />
            </div>
        </>
    )
}