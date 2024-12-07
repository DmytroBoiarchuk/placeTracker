
const WishList = () => {
    const storedArray = JSON.parse(localStorage.getItem("savedPlaces") || "[]")

    return (
        <ul>
            {storedArray.map((placeId: string) => <li>{placeId}</li>)}
        </ul>
    );
};

export default WishList;