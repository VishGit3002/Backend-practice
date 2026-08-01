# ?? Atmos — Weather App

A sleek, full-stack weather application with a stunning animated UI, real-time geolocation, and dynamic weather-reactive backgrounds.

---

## ? Features

- **Auto-detects your location** via the browser Geolocation API
- **Search any city** in the world with validated input
- **Dynamic weather backgrounds** — rain, lightning, snow, clouds, and clear-sky animations adapt to current conditions
- **Stunning aurora background** — layered animated blobs, rotating mesh grid, shimmer sweep, and floating micro-particles
- **Premium glassmorphic widgets** — Feels Like, Wind, Humidity, Visibility, Pressure, Sunrise/Sunset
- **Fully responsive** — looks great on mobile, tablet, and desktop
- **Secure backend** — rate limiting, Helmet.js security headers, input validation & sanitization, strict CORS

---

## ?? Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | React framework with app router |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Lucide React](https://lucide.dev) | Icon library |
| [Axios](https://axios-http.com) | HTTP client |
| [shadcn/ui](https://ui.shadcn.com) | UI components (Input, Button) |

### Backend
| Tech | Purpose |
|------|---------|
| [Express.js 5](https://expressjs.com) | HTTP server |
| [OpenWeatherMap API](https://openweathermap.org/api) | Weather data |
| [Helmet.js](https://helmetjs.github.io) | Security HTTP headers |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | API rate limiting |
| [cors](https://github.com/expressjs/cors) | Cross-origin resource sharing |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |

---

## ?? Getting Started

### Prerequisites
- Node.js 18+
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/VishGit3002/Backend-practice.git
cd Backend-practice/weather-api
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
Api_Key=your_openweathermap_api_key_here
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run start
```

> Backend runs at `http://localhost:3000`

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## ?? API Endpoints

### `GET /api/get-weather`

Fetch weather data by city name **or** coordinates.

**By city name:**
```
GET /api/get-weather?city=London
```

**By coordinates:**
```
GET /api/get-weather?lat=51.5074&lon=-0.1278
```

---

## ?? Security

| Measure | Details |
|---------|---------|
| **Rate Limiting** | 30 requests / 15 min per IP |
| **Helmet.js** | XSS protection, clickjacking prevention, HSTS |
| **CORS** | Strict origin whitelist via environment variable |
| **Input Validation** | lat/lon validated as floats; city validated with regex (max 100 chars) |
| **No URL interpolation** | All API parameters passed as axios param objects |
| **Body size limit** | JSON body capped at 10kb |
| **Scoped error logging** | Full traces only in development mode |

---

## ?? UI Highlights

### Dynamic Weather Backgrounds
- ? Thunderstorm — full-screen lightning flashes + heavy rain
- ?? Rain/Drizzle — 60 animated falling raindrops
- ?? Snow — 80 glowing drifting snowflakes
- ?? Clouds — slow-drifting volumetric cloud orbs
- ?? Clear — warm pulsing sun-glow

### Base Background (always-on)
- 3 morphing aurora blobs (18s / 24s / 30s cycles)
- Ultra-subtle rotating mesh grid
- Diagonal shimmer sweep every 6s
- 18 floating micro-particles

### Premium Loader
- 3 concentric spinning rings at different speeds/directions
- Frosted glass core with cloud icon
- Pulsing label with bouncing dots

---

## ?? Project Structure

```
weather-api/
+-- backend/
¦   +-- controllers/
¦   ¦   +-- weather-controller.js
¦   +-- routes/
¦   ¦   +-- routes.js
¦   +-- index.js
¦   +-- package.json
¦
+-- frontend/
    +-- app/
    ¦   +-- page.tsx
    ¦   +-- layout.tsx
    ¦   +-- globals.css
    +-- package.json
```

---

## ?? License

MIT
