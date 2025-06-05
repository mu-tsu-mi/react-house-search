import "./HouseCard.css";
import UserNotes from "../UserNotes/UserNotes";

export default function HouseCard({ house, onSaveNotes }) {
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
  const sch = house.privateInspectionBoolean
    ? null
    : house.inspectionSchedule[0];
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
          <img src={house.propertyPhoto} />
          <UserNotes house={house} onSaveNotes={onSaveNotes} />
          <div className="inspection">
            <img
              src="/images/magnifying-glass-7563177.png"
              alt="magnifying-glass"
              className="magnifying-glass"
            />
            <span>
              {house.privateInspectionBoolean
                ? "Book a private inspection."
                : `${sch.dayOfWeek} ${sch.day} ${sch.month}`}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
