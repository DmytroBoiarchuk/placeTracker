const apiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function searchRequest(
  query: string | undefined,
  coordinates: { lat: string; lng: string },
) {
  try {
    if (!query) return;
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${coordinates.lat},${coordinates.lng}&radius=${20000}&fields=fsq_id,location,rating`,
      {
        method: "GET",
        headers: { Authorization: apiKey, "Accept-Language": "en" },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData)
      throw new Error(`Error with status: ${response.status.toString()}. Reason: ${errorData.message}`);
    }
    return await response.json();
  } catch (e) {
    console.error("Error occurred:", e);
    throw e
  }
}
