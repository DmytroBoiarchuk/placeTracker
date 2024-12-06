import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRequest } from "../../../../Functions/searchRequest.ts";
import SelectCity from "../SelectCity/SelectCity.tsx";
import classes from "./Search.module.scss";
import MediumButton from "../../../Buttons/MediumButton.tsx";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const location = { lat: 40.7128, lon: -74.006 };
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (searchRef.current) setSearchTerm(searchRef.current?.value);
  }
  const { data } = useQuery({
    queryKey: ["search", searchTerm, location],
    queryFn: () => searchRequest(searchRef.current?.value, location),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    enabled: searchTerm !== "",
  });
  if (data) {
    console.log(data);
  }
  return (
    <div className={classes.searchContainer}>
      <form onSubmit={handleSubmit}>
          <input type="search" placeholder="Search places" ref={searchRef} />{" "}
          <SelectCity />
          <MediumButton type="submit">Search</MediumButton>
      </form>
    </div>
  );
};

export default Search;
