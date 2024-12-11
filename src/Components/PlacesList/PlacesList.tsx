import { useQueryClient } from "@tanstack/react-query";
import classes from "./PlacesList.module.scss";
import { CacheKeyContext } from "../../store/cacheKeyContext.tsx";
import { useContext } from "react";
import { SearchResultInterface } from "../../interfaces/interfaces.ts";
import PlaceCard from "./Components/PlaceCard/PlaceCard.tsx";
import { motion } from "motion/react";

const PlacesList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const cacheKeyCtx = useContext(CacheKeyContext);

  //retrieve query result from cache using keys we got from Context
  const cachedData: SearchResultInterface | undefined =
    queryClient.getQueryData([
      "search",
      cacheKeyCtx.searchTerm,
      cacheKeyCtx.coordinates,
    ]);
  const listItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Задержка для каждого элемента
        duration: 0.5,
      },
    }),
  };
  return (
    <section className={classes.listSection}>
      {!cachedData && (
        <div className={classes.greetingsText}>
          <h1>Welcome!</h1>
          <p>Find Top 10 Places In Chosen City</p>
        </div>
      )}
      {cachedData && (
        <ul className={classes.list}>
          {cachedData?.results
            .sort((a, b) => (b.rating !== undefined ? b.rating - a.rating : -1))
            .filter(
              (p) =>
                p.location.formatted_address !== undefined &&
                p.location.address !== undefined,
            )
            .map((place, index) => (
              <motion.li
                key={place.fsq_id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={listItemVariants}
              >
                <PlaceCard fsq_id={place.fsq_id} />
              </motion.li>
            ))}
        </ul>
      )}
    </section>
  );
};

export default PlacesList;
