# SpendWise Expense Tracker 💸

A premium, full-stack expense tracking application featuring a modern glassmorphic dark-themed UI. Built to help users track their spending effortlessly with real-time analytics and category management.

## 🌟 Features

- **User Authentication**: Secure signup and login flow with JWT (Access & Refresh tokens) and HTTP-only cookies.
- **Modern UI/UX**: Beautiful dark mode design with glassmorphism, Framer Motion animations, and Recharts.
- **Dashboard Analytics**: Visual breakdown of expenses using interactive donut charts and animated count-up statistic cards.
- **Expense Management**: Full CRUD (Create, Read, Update, Delete) functionality for expenses with category tagging.
- **Robust Security**: 
  - Helmet for HTTP security headers
  - Express Rate Limit to prevent brute-force attacks
  - Zod for strict backend input validation
  - Encrypted passwords with bcrypt
- **Responsive**: Fully responsive layout that looks great on mobile, tablet, and desktop screens.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (State Management)
- [Axios](https://axios-http.com/) (API Client with Interceptors)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Recharts](https://recharts.org/) (Data Visualization)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [Zod](https://zod.dev/) (Schema Validation)

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB connection URI (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/VishGit3002/Backend-practice.git
cd Backend-practice/expense-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

Start the backend server:
```bash
npm run start
```
*(The backend runs on http://localhost:3000 by default)*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```
*(The frontend runs on http://localhost:3001 by default)*

## 🌐 Deployment Ready
The application is pre-configured for deployment on platforms like Vercel (Frontend) and Render (Backend). Cross-Origin cookie sharing (`sameSite: "none"`, `secure: true`) is automatically enabled when `NODE_ENV=production`.

## 📄 License
This project is open-source and available under the MIT License.
