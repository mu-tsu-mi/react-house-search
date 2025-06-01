import { useState } from "react";
import "./UserNotes.css";

export default function UserNotes({ house, onSaveNotes }) {
  const [myNotes, setMyNotes] = useState({});
  const handleInputNotes = (e) => {
    setMyNotes({ ...myNotes, [e.target.name]: e.target.value });
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    onSaveNotes(myNotes);
  };
  return (
    <>
      <div className="usernote">
        <div className="short-notes-wrapper">
          <div className="short-notes-pair">
            <div className="short-note">
              <img
                src="/images/tram.png"
                alt="tram"
                className="usernote-icons"
              />
              <input
                name="tram"
                type="text"
                maxLength="30"
                placeholder="Travel time, tram#"
                title="Travel time, tram#"
                onChange={handleInputNotes}
              />
            </div>
            <div className="short-note">
              <img
                src="/images/train.png"
                alt="train"
                className="usernote-icons"
              />
              <input
                name="train"
                type="text"
                maxLength="30"
                placeholder="Travel time, station, railway"
                title="Travel time, station, railway"
                onChange={handleInputNotes}
              />
            </div>
          </div>
          <div className="short-notes-pair">
            <div className="short-note">
              <img src="/images/sun.png" alt="sun" className="usernote-icons" />
              <input
                name="balcony"
                type="text"
                maxLength="50"
                placeholder="Balcony: North-facing..."
                title="Balcony: North-facing..."
                onChange={handleInputNotes}
              />
            </div>
            <div className="short-note">
              <img
                src="/images/shopping-cart.png"
                alt="supermarket"
                className="usernote-icons"
              />
              <input
                name="supermarket"
                type="text"
                maxLength="80"
                placeholder="Supermarket, travel time"
                title="Supermarket, travel time"
                onChange={handleInputNotes}
              />
            </div>
          </div>
        </div>
        <ImportantNotes handleInputNotes={handleInputNotes} />
        <OtherNotes handleInputNotes={handleInputNotes} />
        <button type="submit" onClick={handleSaveNotes}>
          Save
        </button>
      </div>
    </>
  );
}

function ImportantNotes({ handleInputNotes }) {
  return (
    <div className="desc-note">
      <label htmlFor="importantComments">Important note</label>
      <textarea
        name="importantComments"
        maxLength="120"
        rows="3"
        cols="80"
        className="important-note"
        onChange={handleInputNotes}
      ></textarea>
    </div>
  );
}

function OtherNotes({ handleInputNotes }) {
  return (
    <div className="desc-note">
      <label htmlFor="comments">Other things..</label>
      <textarea
        name="comments"
        maxLength="200"
        rows="3"
        cols="100"
        onChange={handleInputNotes}
      ></textarea>
    </div>
  );
}
