import { City } from "../../interfaces/interfaces.ts";

const apiUrl = "https://secure.geonames.org/searchJSON?formatted=true&cities=cities15000&maxRows=1000&username=dmytroboiarchuk";

export const searchCities = async () => {
  try {
    const response = await fetch(
        apiUrl,
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error with status: ${response.status.toString()}. Reason: ${errorData.status.message}`);
    }
    const data = await response.json();
    //filter off small cities
    return await data.geonames.filter(
      (city: City) => city.population >= 100000,
    );
  } catch (e) {
    console.error("Error occurred:", e);
    throw e
  }
};
