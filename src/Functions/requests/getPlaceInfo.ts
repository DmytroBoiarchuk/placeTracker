const apiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function getPlaceInfo(fsq_id: string) {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${fsq_id}?fields=fsq_id,categories,description,photos,rating,tips,name,location`,
      {
        method: "GET",
        headers: { Authorization: apiKey, "Accept-Language": "en" },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error with status: ${response.status.toString()}. Reason: ${errorData.status.message}`,
      );
    }
    return await response.json();
  } catch (e) {
      console.error("Error occurred:", e);
      throw e;
  }
}
