const apiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function searchRequest(
  query: string | undefined,
  coordinates: { lat: string; lng: string },
) {
  try {
    if (!query) return;
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${coordinates.lat},${coordinates.lng}&radius=${20000}&fields=fsq_id,name,location,rating,geocodes,link`,
      {
        method: "GET",
        headers: { Authorization: apiKey, "Accept-Language": "en" },
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
