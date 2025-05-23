
export default function HouseCard({house}) {
let propertyType;
switch(house.propertyType) {
    case 'APARTMENT_UNIT_FLAT':
        propertyType = 'Apartment'
        break;
    case 'HOUSE':
        propertyType = 'House'
        break;
    case 'TOWNHOUSE':
        propertyType = 'Townhouse'
        break;
    default:
        propertyType = 'Unknown'
    
}

const price = (pr, low, high) => {
    if(!pr && !low && !high) {
        return (<p>no price to display</p>)
    } else if(!pr) {
        return (<p>${low.toLocaleString()}~{high.toLocaleString()}</p>)
    } else {
        return (<p>${pr.toLocaleString()}</p>)
    }
}

    return(
        <>
            <div className='house-card-wrapper'>
                <form>
                    <p>{propertyType}</p>
                    <p>{house.address}</p>
                    {price(house.singlePrice, house.lowestPrice, house.highestPrice)}
                    <p>Sale Type: {house.saleType}</p>
                    <div>
                        {/* svg icon */}
                        <span>Bedroom: {house.beds}</span>
                        <span>Bathroom: {house.baths}</span>
                        <span>Parking: {house.parking}</span>
                    </div>
                    <img src={house.propertyPhoto}/>
                    {/* user notes */}
                    <p></p>
                </form>
            </div>
        </>
    )
}