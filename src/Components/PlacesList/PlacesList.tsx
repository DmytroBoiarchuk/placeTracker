import { useQueryClient } from "@tanstack/react-query";
import classes from "./PlacesList.module.scss";
import { CacheKeyContext } from "../../store/cacheKeyContext.tsx";
import { useContext } from "react";
import { SearchResultInterface } from "../../interfaces/interfaces.ts";
import PlaceCard from "./Components/PlaceCard/PlaceCard.tsx";

const PlacesList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const cacheKeyCtx = useContext(CacheKeyContext);
  const cachedData: SearchResultInterface | undefined =
    queryClient.getQueryData([
      "search",
      cacheKeyCtx.searchTerm,
      cacheKeyCtx.coordinates,
    ]);
  return (
    <ul className={classes.list}>
      {cachedData?.results
        .sort((a, b) => b.rating - a.rating)
        .filter((p) =>  p.location.formatted_address !== undefined && p.location.address !== undefined)
        .map((place) => (
          <li key={place.fsq_id}>
            <PlaceCard fsq_id={place.fsq_id} />
          </li>
        ))}
    </ul>
  );
};

export default PlacesList;
