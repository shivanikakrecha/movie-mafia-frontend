
# 🎬 Movie Mafia - Frontend

This is the frontend for **Movie Mafia**, built using **React** and **Vite**. It connects to the FastAPI backend and offers a user-friendly interface to manage and view movie data.

---

## 🚀 Tech Stack

- **React 18**
- **Vite**
- **Axios**
- **React Router DOM**
- **Ant Design / TailwindCSS**
- **JWT Authentication** (stored in `localStorage`)

---

## 📂 Project Structure

```
.
├── src/
│   ├── api/           # API handlers
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route pages
│   ├── services/      # Axios configuration
│   ├── utils/         # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── public/
├── .env
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/shivanikakrecha/movie-mafia-frontend.git
cd movie-mafia-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### 4. Start the development server

```bash
npm run dev
```

---

## 📦 Features

- ✅ Responsive UI
- ✅ Login / Register
- ✅ Upload single or bulk movies via CSV
- ✅ View movie list with poster previews
- ✅ Error handling and toast notifications

---

## 📸 Screenshots

> *(You can add interface screenshots here for better presentation.)*

---

## 🧾 License

MIT License