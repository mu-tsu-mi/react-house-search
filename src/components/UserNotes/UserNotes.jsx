import { useState } from "react";
import "./UserNotes.css";

export default function UserNotes({ house, onSaveNotes, handleDeleteHouse }) {
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
  const [successMsg, setSuccessMsg] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleInputNotes = (e) => {
    setMyNotes({ ...myNotes, [e.target.name]: e.target.value });
  };
  const handleS32 = (e) => {
    e.preventDefault();
    setMyNotes({ ...myNotes, s32: !myNotes.s32 });
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    onSaveNotes(myNotes);
    setTimeout(() => {
      setSuccessMsg("Note: Saved");
      setShowSuccessMsg(true);
      setTimeout(() => {
        setShowSuccessMsg(false);
      }, 3000);
    }, 1000);
  };

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    //  add confirmation msg 'are you sure..?' later
    handleDeleteHouse(house.id);
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
                title="Travel time, tram#"
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
                title="Travel time, station, railway"
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
              <img
                src="/images/sun.png"
                alt="sun"
                className="usernote-icons"
                title="Balcony: North-facing..."
              />
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
                title="Supermarket, travel time"
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
          <div className="short-notes-pair">
            <div className="short-note">
              <img
                src="/images/document-7865347.png"
                alt="documents"
                className="usernote-icons"
                title="Green: Received, Grey: No action yet"
              />
              <button
                className={`${myNotes.s32 ? "s32-button-on" : "s32-button"}`}
                title="Green: Received, Brown: No action yet"
                onClick={handleS32}
              >
                Section 32: {myNotes.s32 ? `YES` : `Not yet`}
              </button>
            </div>
          </div>
        </div>
        <ImportantNotes handleInputNotes={handleInputNotes} myNotes={myNotes} />
        <OtherNotes handleInputNotes={handleInputNotes} myNotes={myNotes} />
        <div className="action-buttons-wrapper">
          <button
            type="submit"
            onClick={handleSaveNotes}
            className="action-button"
          >
            Save
          </button>
          <button
            className="action-button"
            type="submit"
            onClick={handleSubmitDelete}
          >
            Delete
          </button>
          {showSuccessMsg && <span className="success-msg">{successMsg}</span>}
        </div>
        {/* Remove hr after styling house card */}
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
