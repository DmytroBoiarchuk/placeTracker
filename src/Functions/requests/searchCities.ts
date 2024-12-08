import { City } from "../../interfaces/interfaces.ts";

const apiUrl = "https://thingproxy.freeboard.io/fetch/http://api.geonames.org/searchJSON?formatted=true&cities=cities15000&maxRows=1000&username=dmytroboiarchuk";

export const searchCities = async () => {
  try {
    const response = await fetch(
        apiUrl,
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    //filter off small cities
    return await data.geonames.filter(
      (city: City) => city.population >= 100000,
    );
  } catch (error) {
    console.error("City search error:", error);
  }
};
