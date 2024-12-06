import { searchCities } from "../../../../Functions/searchCities.ts";
import React, { ChangeEvent, useState } from "react";
import classes from "./SelectCity.module.scss";
import { useQuery } from "@tanstack/react-query";
import { City } from "../../../../interfaces/interfaces.ts";

const SelectCity = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [cityMatches, setCityMatches] = useState<City[]>([]);
  const { data } = useQuery({
    queryKey: ["CityRequest"],
    queryFn: searchCities,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
  function onCityClickHandler(event: React.MouseEvent<HTMLLIElement>): void {
    if (event.currentTarget.dataset.value)
      setInputValue(event.currentTarget.dataset.value);
    setCityMatches([]);
  }
  function onChangeHandler(event: ChangeEvent<HTMLInputElement>): void {
    const tappedValue = event.target.value;
    setInputValue(event.target.value);
    if (tappedValue !== "")
      setCityMatches(
        data.filter((city: City) =>
          city.name.toLowerCase().startsWith(tappedValue.toLowerCase()),
        ),
      );
    if (tappedValue === "") setCityMatches([]);
  }
  return (
    <div className={classes.selectCity}>
      <input placeholder='Pick the city' value={inputValue} onChange={(e) => onChangeHandler(e)} />
      <ul>
        {cityMatches.map((city: City) => (
          <li
            onClick={(e) => onCityClickHandler(e)}
            key={city.geonameId}
            data-value={city.name}
            data-lat={city.lat}
            data-lng={city.lng}
          >
            {city.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectCity;
