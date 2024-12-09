import React, { createContext, useState } from "react";

export const WishListContext = createContext<{
  storedArray: string[];
  setPlace: (fsq_id: string) => void;
  removePlace: (fsq_id: string) => void;
}>({ storedArray: [], setPlace: () => {}, removePlace: () => {} });

export const WishListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [storedArray, setStoredArray] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("savedPlaces") || "[]"),
  );

  const setPlace = (fsq_id: string) => {
    const newData = [...storedArray, fsq_id];
    localStorage.setItem("savedPlaces", JSON.stringify(newData));
    setStoredArray(newData);
  };

  const removePlace = (fsq_id: string) => {
    const newData = storedArray.filter((storedPlaceId: string) => storedPlaceId !== fsq_id)
    localStorage.setItem("savedPlaces", JSON.stringify(newData));
    setStoredArray(newData);
  };

  return (
    <WishListContext.Provider value={{ storedArray, setPlace, removePlace }}>
      {children}
    </WishListContext.Provider>
  );
};

export default WishListContextProvider;
