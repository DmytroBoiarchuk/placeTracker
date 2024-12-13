import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRequest } from "../../../../Functions/requests/searchRequest.ts";
import SelectCity from "../SelectCity/SelectCity.tsx";
import classes from "./Search.module.scss";
import MediumButton from "../../../Buttons/MediumButton.tsx";
import { CacheKeyContext } from "../../../../store/cacheKeyContext.tsx";
import {CacheContextInterface, SearchResultInterface} from "../../../../interfaces/interfaces.ts";
import {NavigateFunction, useNavigate} from "react-router";
import LoadingSpinner from "../../../../assets/spinner-loading-dots.svg";
import Error from "../../../Error/Error.tsx";
const Search = ():JSX.Element => {
  const navigate:NavigateFunction = useNavigate();
  //city coordinates to fetch
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });

  //check if coordinates valid for fetching
  const isCoordinatesValid:boolean = coordinates.lat !== "" && coordinates.lng !== "";
  //search keyword to fetch
  const [searchTerm, setSearchTerm] = useState<string>("");
  //flag when fetching new query (to prevent infinitive loop)
  const [isCashed, setIsCashed] = useState<boolean>(false);
  //passing cache keys to Context to then retrieve them in result list section
  const cacheCtx:CacheContextInterface = useContext(CacheKeyContext);
  //uncontrolled input ref
  const searchRef = useRef<HTMLInputElement>(null);
  //to show error
  const [showError, setShowError] = useState<boolean>(false);

  // fetch query
  const { data, isLoading, isError, error } = useQuery<SearchResultInterface>({
    queryKey: ["search", searchTerm, coordinates],
    queryFn: () => searchRequest(searchRef.current?.value, coordinates),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // remove cache after 10 min
    enabled: searchTerm !== "" && isCoordinatesValid,
    retry: false,
  });
  // toggle error appearance
  useEffect(() => {
    setShowError(isError);
  }, [isError]);
  //on submit form
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // check if inputs is not empty
    if (
      searchRef.current &&
      searchRef.current.value !== "" &&
      isCoordinatesValid
    ) {
      setSearchTerm(searchRef.current?.value.toLowerCase());
      setIsCashed(false);
      navigate("/");
    }
  }
  //once result is received - update context with it
  useEffect(():void => {
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
        <LoadingSpinner
          className={classes.loadingSpinner}
          style={{ visibility: isLoading ? "visible" : "hidden" }}
          alt="loading..."
        />
      </div>
      {showError && <Error setShowError={setShowError} error={error} />}
    </>
  );
};

export default Search;
