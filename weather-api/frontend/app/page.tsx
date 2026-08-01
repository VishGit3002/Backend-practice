"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Cloud,
  Sun,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Compass,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  dt: number;
  timezone: number;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
          } catch (err) {
            console.error(err);
            setError("Unable to fetch weather for your location.");
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
          handleSearch("London");
        },
      );
    } else {
      handleSearch("London");
    }
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  // Only allow letters, spaces, hyphens, apostrophes (client-side guard)
  const SAFE_CITY_REGEX = /^[a-zA-Z\u00C0-\u024F\s\-',.]*$/;

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/api/get-weather?lat=${lat}&lon=${lon}`,
      );
      setWeather(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchCity = city) => {
    const trimmed = searchCity.trim();
    if (!trimmed) return;

    // Client-side validation guard
    if (trimmed.length > 100) {
      setError("City name is too long (max 100 characters).");
      return;
    }
    if (!SAFE_CITY_REGEX.test(trimmed)) {
      setError("City name contains invalid characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/api/get-weather?city=${encodeURIComponent(trimmed)}`,
      );
      setWeather(res.data.data);
    } catch (err) {
      console.error(err);
      setError("City not found or unable to fetch weather data.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getWindDirection = (deg: number) => {
    const val = Math.floor(deg / 22.5 + 0.5);
    const arr = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return arr[val % 16];
  };

  return (
    <div className="relative min-h-screen bg-[#060608] text-zinc-100 overflow-hidden font-sans selection:bg-zinc-500/30">

      {/* ── Stunning multi-layer background ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Aurora blob 1 — large, top-left, cool white */}
        <div className="absolute -top-[30%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-white/[0.04] blur-[160px] animate-aurora-1"></div>

        {/* Aurora blob 2 — large, bottom-right, warm tint */}
        <div className="absolute -bottom-[30%] -right-[20%] w-[70vw] h-[70vw] rounded-full bg-zinc-300/[0.04] blur-[140px] animate-aurora-2"></div>

        {/* Aurora blob 3 — mid accent */}
        <div className="absolute top-[20%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-zinc-500/[0.05] blur-[120px] animate-aurora-3"></div>

        {/* Rotating mesh grid — very subtle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[140vw] h-[140vw] opacity-[0.03] animate-mesh-slow"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Shimmer sweep line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full animate-shimmer">
            <div className="w-[40%] h-full bg-gradient-to-r from-transparent via-white/[0.025] to-transparent" />
          </div>
        </div>

        {/* Floating micro-particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute rounded-full bg-white animate-float"
            style={{
              width:  `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              left:   `${(i * 19 + 7) % 100}%`,
              bottom: `-10px`,
              animationDuration: `${8 + (i * 3.7) % 14}s`,
              animationDelay:    `${(i * 1.3) % 8}s`,
              opacity: 0.3,
            }}
          />
        ))}

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060608] to-transparent" />
        {/* Top edge fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#060608] to-transparent" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-8 py-4 sm:py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/[0.05] backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
            <Cloud className="w-5 h-5 text-zinc-300" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
            Atmos
          </span>
        </div>

        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full px-2 py-1 shadow-2xl transition-all duration-300 group-focus-within:bg-white/[0.08] group-focus-within:border-white/20">
            <Search className="w-4 h-4 text-zinc-500 ml-3 shrink-0" />
            <Input
              placeholder="Search cities..."
              value={city}
              maxLength={100}
              onChange={(e) => {
                const safe = e.target.value.replace(/[^a-zA-Z\u00C0-\u024F\s\-',.]/g, "");
                setCity(safe);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent border-none text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 h-10 w-full px-3 shadow-none"
            />
          </div>
        </div>
      </nav>

      {loading && (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
          {/* 3-ring premium spinner */}
          <div className="relative w-28 h-28">
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-full border border-white/10 animate-ring-pulse" />
            {/* Spinning ring 1 — thin, fast */}
            <div className="absolute inset-[6px] rounded-full border-[1.5px] border-transparent border-t-zinc-300 border-r-zinc-500/40 animate-ring-spin" />
            {/* Spinning ring 2 — thicker, slow reverse */}
            <div className="absolute inset-[16px] rounded-full border-[2px] border-transparent border-t-zinc-500 border-l-zinc-600/30 animate-ring-rev" />
            {/* Inner glow core */}
            <div className="absolute inset-[28px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
              <Cloud className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
          {/* Pulsing label */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-zinc-400 animate-loader-text">
              Fetching weather
            </span>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-zinc-500 animate-ring-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-950/20 backdrop-blur-xl border border-red-900/50 rounded-3xl text-red-400 text-center shadow-2xl">
          <p className="text-lg font-medium">{error}</p>
        </div>
      )}

      {!loading && weather && (
        <main className="relative z-10 flex flex-col justify-between min-h-[calc(100vh-100px)] max-w-screen-2xl mx-auto px-4 sm:px-8 pb-8">
          {/* Center Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-zinc-900/30 backdrop-blur-lg rounded-full border border-zinc-800 mb-6 sm:mb-8 shadow-2xl">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
              <span className="text-base sm:text-lg font-medium tracking-wide text-zinc-200">
                {weather.name}
              </span>
            </div>

            <div className="flex items-start">
              <h1 className="text-[5rem] sm:text-[8rem] lg:text-[12rem] font-light leading-none tracking-tighter drop-shadow-2xl text-white">
                {Math.round(weather.main.temp)}
              </h1>
              <span className="text-3xl sm:text-4xl lg:text-6xl font-light mt-4 sm:mt-6 lg:mt-8 text-zinc-500">°</span>
            </div>

            <div className="flex flex-col items-center mt-4 sm:mt-6">
              <p className="text-lg sm:text-2xl lg:text-3xl font-medium tracking-wide capitalize text-zinc-200 drop-shadow-lg flex items-center gap-2 sm:gap-4">
                <Sun className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-zinc-400 shrink-0" />
                {weather.weather[0].description}
              </p>
              <div className="flex items-center gap-5 sm:gap-8 mt-4 sm:mt-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/10 border border-red-500/20">
                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-zinc-500 uppercase font-bold tracking-widest">
                      High
                    </span>
                    <span className="text-base sm:text-lg font-medium text-zinc-200">
                      {Math.round(weather.main.temp_max)}°
                    </span>
                  </div>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-zinc-500 uppercase font-bold tracking-widest">
                      Low
                    </span>
                    <span className="text-base sm:text-lg font-medium text-zinc-200">
                      {Math.round(weather.main.temp_min)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Glassmorphic Widget Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            {/* Widget: Feels Like */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Thermometer className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Feels Like
                </span>
              </div>
              <p className="text-3xl font-semibold mb-2 text-zinc-100">
                {Math.round(weather.main.feels_like)}°
              </p>
            </div>

            {/* Widget: Wind */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Wind className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Wind
                </span>
              </div>
              <p className="text-3xl font-semibold mb-1 text-zinc-100">
                {Math.round(weather.wind.speed * 3.6)}{" "}
                <span className="text-lg text-zinc-600 font-medium">km/h</span>
              </p>
              <p className="text-sm text-zinc-500 flex items-center gap-1">
                <Compass className="w-3 h-3" />{" "}
                {getWindDirection(weather.wind.deg)}
              </p>
            </div>

            {/* Widget: Humidity */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Droplets className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Humidity
                </span>
              </div>
              <p className="text-3xl font-semibold mb-2 text-zinc-100">
                {weather.main.humidity}%
              </p>
            </div>

            {/* Widget: Visibility */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Eye className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Visibility
                </span>
              </div>
              <p className="text-3xl font-semibold mb-2 text-zinc-100">
                {weather.visibility / 1000}{" "}
                <span className="text-lg text-zinc-600 font-medium">km</span>
              </p>
            </div>

            {/* Widget: Pressure */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Gauge className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Pressure
                </span>
              </div>
              <p className="text-3xl font-semibold mb-2 text-zinc-100">
                {weather.main.pressure}{" "}
                <span className="text-lg text-zinc-600 font-medium">hPa</span>
              </p>
            </div>

            {/* Widget: Sun Cycle */}
            <div className="group bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 shadow-2xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <Sunrise className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Sun Cycle
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Rise</span>
                  <span className="text-lg font-medium text-zinc-200">
                    {formatTime(weather.sys.sunrise, weather.timezone)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Set</span>
                  <span className="text-lg font-medium text-zinc-200">
                    {formatTime(weather.sys.sunset, weather.timezone)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
