import "./HouseCard.css";
import UserNotes from "../UserNotes/UserNotes";

export default function HouseCard({ house, onSaveNotes, handleDeleteHouse }) {
  let propertyType;
  switch (house.propertyType) {
    case "APARTMENT_UNIT_FLAT":
      propertyType = "Apartment";
      break;
    case "HOUSE":
      propertyType = "House";
      break;
    case "TOWNHOUSE":
      propertyType = "Townhouse";
      break;
    default:
      propertyType = "Unknown";
  }

  const price = (pr, low, high) => {
    if (!pr && !low && !high) {
      return <div>no price to display</div>;
    } else if (!pr) {
      return (
        <div>
          ${low.toLocaleString()}~{high.toLocaleString()}
        </div>
      );
    } else {
      return <div>${pr.toLocaleString()}</div>;
    }
  };

  const inspectionSchedule = (house) => {
    if (house.privateInspectionBoolean) {
      return "Book a private inspection";
    }
    if (house.inspectionSchedule && house.inspectionSchedule.length > 0) {
      const sch = house.inspectionSchedule[0];
      return `${sch.dayOfWeek} ${sch.day} ${sch.month}`;
    }
    return "Contact the agent for more details";
  };

  return (
    <>
      <div className="house-card-wrapper">
        <form>
          <div>
            <span className="property-type">{propertyType}</span>
            <span>{house.address}</span>
          </div>
          {price(house.singlePrice, house.lowestPrice, house.highestPrice)}
          <div>Sale Type: {house.saleType}</div>
          <div>
            <img src="/images/bed-1179855.png" alt="bed" className="spec" />
            <span>{house.beds}</span>
            <img
              src="/images/bathtub-7902075.png"
              alt="bath"
              className="spec"
            />
            <span>{house.baths}</span>
            <span>
              <img src="/images/car-7897277.png" alt="car" className="spec" />
              {house.parking}
            </span>
          </div>
          <img src={house.propertyPhoto} alt="property-image" />
          <UserNotes
            house={house}
            onSaveNotes={onSaveNotes}
            handleDeleteHouse={handleDeleteHouse}
          />
          <div className="inspection">
            <img
              src="/images/magnifying-glass-7563177.png"
              alt="magnifying-glass"
              className="magnifying-glass"
            />
            <span>{inspectionSchedule(house)}</span>
          </div>
        </form>
      </div>
    </>
  );
}
