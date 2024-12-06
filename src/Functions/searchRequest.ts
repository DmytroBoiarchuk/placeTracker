const apiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function searchRequest(
  query: string | undefined,
  location: { lat: number; lon: number },
) {
  try {
    if (!query) return;
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${location.lat},${location.lon}`,
      { method: "GET", headers: { Authorization: apiKey } },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
