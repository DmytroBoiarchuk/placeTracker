import PlaceCard from "../PlacesList/Components/PlaceCard/PlaceCard.tsx";
import classes from "./WishList.module.scss";
import {useContext} from "react";
import {WishListContext} from "../../store/wishListContext.tsx";

const WishList = () => {
  //array of cards(places) stored in local storage
  const storedArray = useContext(WishListContext).storedArray;

  return (
    <section className={classes.listSection}>
      {storedArray.length === 0 && <h1 className={classes.noAddedYet}>No cities added yet :(</h1>}
      {storedArray.length !== 0 && (
        <ul className={classes.list}>
          {storedArray.map((placeId: string) => (
            <li key={placeId}>
              <PlaceCard fsq_id={placeId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WishList;
