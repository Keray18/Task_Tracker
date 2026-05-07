# TaskTracker

Simple task tracking app with:
- `frontend` (Expo React Native app)
- `backend` (Node.js + Express + MongoDB API)

## Setup

1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Create a `.env` file in `backend`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

## Run Backend

From `backend`:

```bash
npm run dev
```

## Run Frontend

From `frontend`:

```bash
npm start
```

Use Expo options in terminal (`a`, `i`, or QR code) to open the app.
