import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRequest } from "../../../../Functions/requests/searchRequest.ts";
import SelectCity from "../SelectCity/SelectCity.tsx";
import classes from "./Search.module.scss";
import MediumButton from "../../../Buttons/MediumButton.tsx";
import { CacheKeyContext } from "../../../../store/cacheKeyContext.tsx";
import { SearchResultInterface } from "../../../../interfaces/interfaces.ts";
import { useNavigate } from "react-router";
import loadingSpinner from "../../../../assets/spinner-loading-dots.svg";
import Error from "../../../Error/Error.tsx";
const Search = () => {
  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });
  const isCoordinatesValid =  coordinates.lat !== "" &&
      coordinates.lng !== ""
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCashed, setIsCashed] = useState<boolean>(false);
  const cacheCtx = useContext(CacheKeyContext);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError, error } = useQuery<SearchResultInterface>({
    queryKey: ["search", searchTerm, coordinates],
    queryFn: () => searchRequest(searchRef.current?.value, coordinates),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // remove cache after 10 min
    enabled: searchTerm !== "" && isCoordinatesValid,
    retry: false,
  });
  if (isError) {
    console.log(error);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (
      searchRef.current &&
      searchRef.current.value !== "" &&
      coordinates.lat !== "" &&
      coordinates.lng !== ""
    ) {
      // check if inputs is not empty
      setSearchTerm(searchRef.current?.value.toLowerCase());
      setIsCashed(false);
      navigate("/");
    }
  }
  useEffect(() => {
    if (data && searchTerm && !isCashed) {
      cacheCtx.addCache(searchTerm, coordinates);
      setIsCashed(true);
    }
  }, [data, searchTerm, coordinates, cacheCtx, isCashed, setIsCashed]);

  return (
    <>
      <div className={classes.searchContainer}>
        <form onSubmit={handleSubmit}>
          <div className={classes.searchInputContainer}>
            <p>Find: </p>
            <input type="search" placeholder="ex: Big Ben" ref={searchRef} />
          </div>
          <div className={classes.searchInputContainer}>
            <p>In: </p>
            <SelectCity setCoordinates={setCoordinates} />
            <MediumButton type="submit">Search</MediumButton>
          </div>
        </form>
        <img
          className={classes.loadingSpinner}
          src={loadingSpinner}
          style={{ visibility: isLoading ? "visible" : "hidden" }}
          alt="loading..."
        />
      </div>
      {isError && <Error error={error} />}
    </>
  );
};

export default Search;
