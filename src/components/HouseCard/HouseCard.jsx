
export default function HouseCard({house}) {

    return(
        <>
            <div className='house-card-wrapper'>
                <form>
                    {/* propertyType */}
                    <p>{house.address}</p>
                    <p>${house.lowestPrice}~{house.highestPrice}</p>
                    <p>Sale Type: {house.saleType}</p>
                    <img src={house.propertyPhoto}/>
                </form>
            </div>
        </>
    )
}