import { useState } from "react";
import "./UserNotes.css";

export default function UserNotes({ house, onSaveNotes }) {
  const [myNotes, setMyNotes] = useState({
    tram: house.userNotes.tram,
    train: house.userNotes.train,
    balcony: house.userNotes.balcony,
    supermarket: house.userNotes.supermarket,
    s32: house.userNotes.s32,
    importantComments: house.userNotes.importantComments,
    comments: house.userNotes.comments,
    preference: house.userNotes.preference,
  });

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
                value={myNotes.tram}
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
                value={myNotes.train}
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
                value={myNotes.balcony}
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
                value={myNotes.supermarket}
                type="text"
                maxLength="80"
                placeholder="Supermarket, travel time"
                title="Supermarket, travel time"
                onChange={handleInputNotes}
              />
            </div>
          </div>
        </div>
        <ImportantNotes handleInputNotes={handleInputNotes} myNotes={myNotes} />
        <OtherNotes handleInputNotes={handleInputNotes} myNotes={myNotes} />
        <button type="submit" onClick={handleSaveNotes}>
          Save
        </button>
        <hr />
      </div>
    </>
  );
}

function ImportantNotes({ handleInputNotes, myNotes }) {
  return (
    <div className="desc-note">
      <img
        src="/images/triangle-flag-4773926.png"
        alt="triangle-flag"
        className="usernote-icons"
      />
      <textarea
        name="importantComments"
        value={myNotes.importantComments}
        maxLength="120"
        rows="3"
        cols="100"
        placeholder="Important points"
        className="important-note"
        onChange={handleInputNotes}
      ></textarea>
    </div>
  );
}

function OtherNotes({ handleInputNotes, myNotes }) {
  return (
    <div className="desc-note">
      <img
        src="/images/pencil-7927074.png"
        className="usernote-icons"
        alt="pencil"
      />
      <textarea
        name="comments"
        value={myNotes.comments}
        maxLength="200"
        rows="3"
        cols="100"
        placeholder="Other things.."
        className="other-note"
        onChange={handleInputNotes}
      ></textarea>
    </div>
  );
}
