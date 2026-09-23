# Backend Posts

A Node.js + Express backend for a video/social platform (think a mini YouTube + Twitter). It handles users, videos, posts, comments, likes, subscriptions, tweets, playlists, and a creator dashboard — with JWT auth and Cloudinary file uploads.

## Features

- **Auth** — register/login with hashed passwords (bcrypt), access + refresh tokens (JWT), cookie-based sessions
- **Users** — update profile, avatar/cover image upload, channel profile, watch history
- **Videos & Posts** — create, update, delete, search, and paginate content
- **Social graph** — subscriptions, likes, comments, tweets
- **Playlists** and a **dashboard** for creator stats
- **File uploads** — Multer for handling uploads, Cloudinary for storage
- **Consistent API shape** — standardized `ApiResponse` / `ApiError` classes and an `asyncHandler` wrapper so routes don't repeat try/catch boilerplate

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose (with aggregate pagination) |
| Auth | JWT + bcrypt |
| File storage | Multer (local temp) → Cloudinary (cloud) |
| Dev tooling | Nodemon, Prettier |

## Project Structure

```
src/
├── controllers/     # Request handlers (business logic)
├── models/          # Mongoose schemas (User, Video, Post, Comment, Like, Subscription, Tweet, Playlist)
├── routes/          # Express routers, one per resource
├── middlewares/      # auth (JWT verification), multer (file uploads)
├── utils/           # ApiError, ApiResponse, asyncHandler, cloudinary helper
├── db/              # MongoDB connection
├── app.js           # Express app setup (middleware, routes)
├── constants.js     # DB name, etc.
└── index.js         # Entry point — loads env, connects DB, starts server
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (Atlas or local)
- A Cloudinary account (for image/video uploads)

### 1. Clone and install

```bash
git clone https://github.com/mudasiranberlin/backend-posts.git
cd backend-posts
npm install
```

### 2. Configure environment variables

Create a file named `.env` in the project root:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Note: `index.js` currently loads env from a file named `env` (`dotenv.config({ path: './env' })`). Either rename your file to `env`, or update that line to `'.env'` to match the standard convention above.

### 3. Run the server

```bash
npm run dev
```

The server starts on the port set in `.env` (defaults to `8080`) and restarts automatically on file changes.

## API Overview

All routes are mounted under `/api/v1`.

| Resource | Base path | Examples |
|---|---|---|
| Users | `/api/v1/users` | `POST /register`, `POST /login`, `POST /logout`, `GET /current-user`, `PATCH /avatar` |
| Posts | `/api/v1/posts` | `POST /create`, `GET /getPosts`, `PATCH /updatePost/:id`, `DELETE /deletePost/:id` |
| Videos | `/api/v1/video` | video CRUD + pagination |
| Subscriptions | `/api/v1/subscription` | subscribe/unsubscribe to channels |
| Comments | `/api/v1/Comment` | comment CRUD |
| Likes | `/api/v1/like` | like/unlike content |
| Tweets | `/api/v1/tweet` | short-post CRUD |
| Playlists | `/api/v1/playlist` | playlist CRUD |
| Dashboard | `/api/v1/dash` | creator stats |

Most write/protected routes require a valid access token, sent either as a cookie or as `Authorization: Bearer <token>`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the server with Nodemon (auto-restart on changes) |

## Author

**Mudasir Ahmad** ([@mudasiranberlin](https://github.com/mudasiranberlin))
