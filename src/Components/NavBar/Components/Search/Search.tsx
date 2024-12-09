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
  //city coordinates to fetch
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });

  //check if coordinates valid for fetching
  const isCoordinatesValid = coordinates.lat !== "" && coordinates.lng !== "";
  //search keyword to fetch
  const [searchTerm, setSearchTerm] = useState<string>("");
  //flag when fetching new query (to prevent infinitive loop)
  const [isCashed, setIsCashed] = useState<boolean>(false);
  //passing cache keys to Context to then retrieve them in result list section
  const cacheCtx = useContext(CacheKeyContext);
  //uncontrolled input ref
  const searchRef = useRef<HTMLInputElement>(null);

  // fetch query
  const { data, isLoading, isError, error } = useQuery<SearchResultInterface>({
    queryKey: ["search", searchTerm, coordinates],
    queryFn: () => searchRequest(searchRef.current?.value, coordinates),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // remove cache after 10 min
    enabled: searchTerm !== "" && isCoordinatesValid,
    retry: false,
  });
  //on submit form
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (
      searchRef.current &&
      searchRef.current.value !== "" &&
      isCoordinatesValid
    ) {
      // check if inputs is not empty
      setSearchTerm(searchRef.current?.value.toLowerCase());
      setIsCashed(false);
      navigate("/");
    }
  }
  //once result is received - update context with it
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
