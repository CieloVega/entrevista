# Kanban App

A fullstack Kanban board built with React (Create React App), Express, Prisma, and TailwindCSS.

## Features

- User authentication (login/register)
- Kanban board (create, move, delete tasks)
- Persistent tasks (stored in database)
- Responsive UI with TailwindCSS

---

## Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node)
- PostgreSQL, MySQL, or SQLite (for Prisma DB; SQLite is easiest for local dev)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Set up Prisma

- Edit `backend/prisma/schema.prisma` to match your database.
- Create a `.env` file in `backend/` with your database URL:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

- Run migrations and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 4. Start the backend server

```bash
cd backend
npm start
```
or
```bash
node app.js
```

The backend runs on `http://localhost:3001`

---

### 5. Install frontend dependencies

```bash
npm install
```

### 6. Set up TailwindCSS

If not already set up, run:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Add the following to the top of your `src/index.css` (or `src/App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Configure `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

---

### 7. Start the frontend

```bash
npm start
```

The frontend runs on `http://localhost:3000`

---

## Usage

- Open [http://localhost:3000](http://localhost:3000)
- Register a new user or login.
- Create, move, and delete tasks on the Kanban board.

---

## Environment Variables

**Backend (.env):**
- `DATABASE_URL` — connection string for your database  
- `JWT_SECRET` — secret for JWT authentication

---

## Troubleshooting

- If you have DB errors, check your `.env` and database setup.
- If CORS errors, make sure your backend allows requests from `localhost:3000`.

---

## License

MIT
