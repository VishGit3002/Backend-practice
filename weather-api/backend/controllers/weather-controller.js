import axios from "axios";

// ─── Validation helpers ───────────────────────────────────────────────────────
const MAX_CITY_LENGTH = 100;
// Allow only letters, spaces, hyphens, apostrophes, commas (international city names)
const CITY_REGEX = /^[a-zA-Z\u00C0-\u024F\s\-',\.]+$/;

function isValidCoord(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num >= min && num <= max;
}

async function getWeather(req, res) {
    try {
        let { lat, lon, city } = req.query;

        // ── Validate lat/lon ──────────────────────────────────────────────────
        if (lat !== undefined || lon !== undefined) {
            if (!isValidCoord(lat, -90, 90)) {
                return res.status(400).json({ message: "Invalid latitude. Must be a number between -90 and 90." });
            }
            if (!isValidCoord(lon, -180, 180)) {
                return res.status(400).json({ message: "Invalid longitude. Must be a number between -180 and 180." });
            }
            // Normalize to safe float strings
            lat = parseFloat(lat).toFixed(6);
            lon = parseFloat(lon).toFixed(6);
        }

        // ── Validate city ─────────────────────────────────────────────────────
        if (!lat || !lon) {
            if (!city) {
                return res.status(400).json({ message: "Must provide either city or lat/lon." });
            }

            city = city.trim();

            if (city.length > MAX_CITY_LENGTH) {
                return res.status(400).json({ message: `City name too long (max ${MAX_CITY_LENGTH} characters).` });
            }
            if (!CITY_REGEX.test(city)) {
                return res.status(400).json({ message: "City name contains invalid characters." });
            }

            // ── Geocode the city ──────────────────────────────────────────────
            const geo = await axios.get("http://api.openweathermap.org/geo/1.0/direct", {
                params: { q: city, limit: 1, appid: process.env.Api_Key },
            });

            if (!geo.data || geo.data.length === 0) {
                return res.status(404).json({ message: "City not found." });
            }

            lat = geo.data[0].lat;
            lon = geo.data[0].lon;
        }

        // ── Fetch weather ─────────────────────────────────────────────────────
        const result = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: { lat, lon, units: "metric", appid: process.env.Api_Key },
        });

        return res.json({ data: result.data });

    } catch (error) {
        // Log internally but never expose stack traces or API keys to the client
        const isDev = process.env.NODE_ENV !== "production";
        if (isDev) {
            console.error("Error while fetching weather data:", error.message);
        } else {
            console.error("Weather fetch error:", error.response?.status ?? "unknown");
        }
        return res.status(500).json({ message: "Internal server error." });
    }
}

export default getWeather;