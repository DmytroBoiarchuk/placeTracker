import { searchCities } from "../../../../Functions/requests/searchCities.ts";
import React, { ChangeEvent, useState } from "react";
import classes from "./SelectCity.module.scss";
import { useQuery } from "@tanstack/react-query";
import { City } from "../../../../interfaces/interfaces.ts";
import Error from "../../../Error/Error.tsx";

const SelectCity = ({
  setCoordinates,
}: {
  setCoordinates: React.Dispatch<
    React.SetStateAction<{ lat: string; lng: string }>
  >;
}) => {
  const [listIsShown, setListIsShown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [cityMatches, setCityMatches] = useState<City[]>([]);
  //request cities list for City selector from geonames API
  const { data, error, isError } = useQuery<City[]>({
    queryKey: ["CityRequest"],
    queryFn: searchCities,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  //react on click event when user chose city
  function onCityClickHandler(event: React.MouseEvent<HTMLLIElement>): void {
    if (event.currentTarget.dataset.value)
      setInputValue(event.currentTarget.dataset.value);
    setCoordinates({
      lat: event.currentTarget.dataset.lat!,
      lng: event.currentTarget.dataset.lng!,
    });
    setCityMatches([]);
  }
  //toggle list appearance
  function toggleListIsShown(isShown: boolean) {
    setListIsShown(isShown);
  }
  //show possible options of cities when user write in input
  function onChangeHandler(event: ChangeEvent<HTMLInputElement>): void {
    //set coordinates in case user did not choose the city from Matches list
    const prefilteredCities = data?.filter(
      (city: City) =>
        city.name.toLowerCase() === event.target.value.toLowerCase(),
    );
    if (prefilteredCities && prefilteredCities.length > 0) {
      setCoordinates({
        lat: prefilteredCities[0].lat,
        lng: prefilteredCities[0].lng,
      });
    }
    //control input value and show matched cities
    const tappedValue = event.target.value;
    setInputValue(event.target.value);
    if (tappedValue !== "" && data)
      setCityMatches(
        data.filter((city: City) =>
          city.name.toLowerCase().startsWith(tappedValue.toLowerCase()),
        ),
      );
    if (tappedValue === "") {
      setCityMatches([]);
      setCoordinates({ lat: "", lng: "" });
    }
  }
  return (
    <>
      <div className={classes.selectCity}>
        <input
          type="search"
          onFocus={() => toggleListIsShown(true)}
          onBlur={() => toggleListIsShown(false)}
          placeholder="ex: London"
          value={inputValue}
          onChange={(e) => onChangeHandler(e)}
        />
        {listIsShown && (
          <ul>
            {cityMatches.map((city: City) => (
              <li
                onMouseDown={(e) => onCityClickHandler(e)}
                key={city.geonameId}
                data-value={city.name}
                data-lat={city.lat}
                data-lng={city.lng}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isError && <Error error={error} />}
    </>
  );
};

export default SelectCity;
