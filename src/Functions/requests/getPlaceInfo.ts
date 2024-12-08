const apiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function getPlaceInfo (fsq_id: string) {
    //https://api.foursquare.com/v3/places/${fsq_id}?fields=fsq_id,categories,description,photos
    try {
        const response = await fetch(
            `https://api.foursquare.com/v3/places/${fsq_id}?fields=fsq_id,categories,description,photos,rating,tips,name,location`,{
            method: "GET",
            headers: { Authorization: apiKey, "Accept-Language": "en" },
    }
        );
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();

    } catch (error) {
        console.error("City search error:", error);
    }
}