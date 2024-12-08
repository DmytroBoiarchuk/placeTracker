import PlaceCard from "../PlacesList/Components/PlaceCard/PlaceCard.tsx";
import classes from "./WishList.module.scss";

const WishList = () => {
  const storedArray = JSON.parse(localStorage.getItem("savedPlaces") || "[]");

  return (
    <ul className={classes.list}>
      {storedArray.map((placeId: string) => (
        <li key={placeId}>
          <PlaceCard fsq_id={placeId} />
        </li>
      ))}
    </ul>
  );
};

export default WishList;
