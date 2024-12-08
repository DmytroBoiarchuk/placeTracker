import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRequest } from "../../../../Functions/requests/searchRequest.ts";
import SelectCity from "../SelectCity/SelectCity.tsx";
import classes from "./Search.module.scss";
import MediumButton from "../../../Buttons/MediumButton.tsx";
import { CacheKeyContext } from "../../../../store/cacheKeyContext.tsx";
import { SearchResultInterface } from "../../../../interfaces/interfaces.ts";
import { useNavigate } from "react-router";

const Search = () => {
  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCashed, setIsCashed] = useState<boolean>(false);
  const cacheCtx = useContext(CacheKeyContext);
  const searchRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (searchRef.current) {
      setSearchTerm(searchRef.current?.value.toLowerCase());
      setIsCashed(false);
    }
  }

  const { data, isPending } = useQuery<SearchResultInterface>({
    queryKey: ["search", searchTerm, coordinates],
    queryFn: () => searchRequest(searchRef.current?.value, coordinates),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    enabled: searchTerm !== "",
  });
  useEffect(() => {
    if (!isPending) {
      navigate("/");
    }
  }, [isPending, navigate]);
  useEffect(() => {
    if (data && searchTerm && !isCashed) {
      cacheCtx.addCache(searchTerm, coordinates);
      setIsCashed(true);
    }
  }, [data, searchTerm, coordinates, cacheCtx, isCashed, setIsCashed]);

  return (
    <div className={classes.searchContainer}>
      <form onSubmit={handleSubmit}>
        <input type="search" placeholder="Search places" ref={searchRef} />
        <SelectCity setCoordinates={setCoordinates} />
        <MediumButton type="submit">Search</MediumButton>
      </form>
    </div>
  );
};

export default Search;
