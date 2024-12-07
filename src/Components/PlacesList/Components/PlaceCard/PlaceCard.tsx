import classes from "./PlaceCard.module.scss";
import {
  DemoPlaceDataInterface,
  PlaceInterface,
} from "../../../../interfaces/interfaces.ts";
import { useQuery } from "@tanstack/react-query";
import { getPlaceInfo } from "../../../../Functions/requests/getPlaceInfo.ts";
import noImageYet from "../../../../assets/products_noimageyet.jpg";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { useState } from "react";
import loadingSpinner from "../../../../assets/spinner-loading-dots.svg";

const PlaceCard = ({ place }: { place: PlaceInterface }): JSX.Element => {
  const wasSaved: boolean = JSON.parse(
    localStorage.getItem("savedPlaces") || "[]",
  ).some((savedPlace: string) => savedPlace === place.fsq_id);
  const [isSaved, setIsSaved] = useState<boolean>(wasSaved);
  const sizeOfIcon: string = "64";
  function onSaveHandler(save: boolean) {
    const storedArray = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
    const toStore = save
      ? [...storedArray, place.fsq_id]
      : storedArray.filter(
          (storedPlaceId: string) => storedPlaceId !== place.fsq_id,
        );
    localStorage.setItem("savedPlaces", JSON.stringify(toStore));
    setIsSaved(save);
  }
  const { data, isPending } = useQuery<DemoPlaceDataInterface>({
    queryKey: ["search", place.fsq_id],
    queryFn: () => getPlaceInfo(place.fsq_id),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
  return (
    <div
      className={
        !isPending ? classes.card : `${classes.card} ${classes.cardInPending}`
      }
    >
      {isPending && (
        <img className={classes.loading} src={loadingSpinner} alt="spiner" />
      )}
      {!isPending && (
        <>
          <img
            className={classes.icon}
            src={`${data?.categories[0].icon.prefix}${sizeOfIcon}${data?.categories[0].icon.suffix}`}
            alt="ICON"
          />
          <div className={classes.photoContainer}>
            <img
              src={
                data?.photos[0]
                  ? `${data?.photos[0].prefix}${data?.photos[0].width}x${data?.photos[0].height}${data?.photos[0].suffix}`
                  : noImageYet
              }
              alt="place-photo"
            />
          </div>
          <div className={classes.infoWrapper}>
            <h1>
              {place.name}{" "}
              {place.rating && (
                <span className={classes.rating}>({place.rating}/10)</span>
              )}
            </h1>

            {data?.description && (
              <p className={classes.description}>{data?.description}</p>
            )}
            <div className={classes.location}>
              <CiLocationOn />
              <p>
                {place.location.address ?? place.location.formatted_address}
              </p>
            </div>
          </div>
        </>
      )}
      {!isPending && !isSaved && (
        <button
          onClick={() => onSaveHandler(true)}
          className={classes.savedSign}
        >
          <FaRegHeart />
        </button>
      )}
      {!isPending && isSaved && (
        <button
          onClick={() => onSaveHandler(false)}
          className={classes.savedSign}
        >
          <FaHeart />
        </button>
      )}
    </div>
  );
};

export default PlaceCard;
