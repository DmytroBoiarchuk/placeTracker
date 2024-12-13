import {
    Context,
    createContext,
    ReactNode,
    useCallback, useMemo,
    useState,
} from "react";
import {
  CacheContextInterface,
  CacheContextReadOnlyInterface,
} from "../interfaces/interfaces.ts";

export const ctxInitialValue: CacheContextInterface = {
  searchTerm: "",
  coordinates: { lat: "", lng: "" },
  addCache: () => {},
};

export const CacheKeyContext: Context<CacheContextInterface> =
  createContext(ctxInitialValue);

const CacheKeyContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [cache, setCache] =
    useState<CacheContextReadOnlyInterface>(ctxInitialValue);

  const addCache = useCallback(
    function addCache(term: string, coords: { lat: string; lng: string }) {
      setCache({
        searchTerm: term,
        coordinates: coords,
      });
    },
    [setCache],
  );

    const cacheValue: CacheContextInterface = useMemo(
        () => ({
            searchTerm: cache.searchTerm,
            coordinates: cache.coordinates,
            addCache,
        }),
        [cache, addCache]
    );

  return (
    <CacheKeyContext.Provider value={cacheValue}>
      {children}
    </CacheKeyContext.Provider>
  );
};

export default CacheKeyContextProvider;
