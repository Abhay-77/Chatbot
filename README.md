# 💬 Chatbot Website

A modern chatbot web application built with **Vite + React** on the frontend and **Express.js** on the backend.

---

## 📁 Project Structure

```
root/
├── frontend/           # Vite + React frontend
│   ├── src/
│   ├── index.html
│   └── vite.config.js
├── backend/           # Express backend
│   ├── routes/
│   ├── server.js
│   └── ...
├── package.json      # Main workspace config (if using npm workspaces)
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend (Vite + React)

* Vite for lightning-fast dev environment
* React for UI
* Tailwind CSS / ShadCN (optional, for UI components)
* Axios for API calls

### Backend (Express)

* Express.js for handling chat requests
* CORS + body-parser middleware
* OpenAI or other chatbot logic can be plugged in

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chatbot-vite-express.git
cd chatbot-vite-express
```

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

---

### 3. Run the app in development

#### Start backend

```bash
cd server
npm run dev
# or: nodemon server.js
```

#### Start frontend

```bash
cd ../client
npm run dev
```

* Frontend runs at: `http://localhost:5173`
* Backend runs at: `http://localhost:3000`

---

## 🔄 How It Works

1. User types a message in the chatbot interface.
2. The frontend sends the message to the Express API via `POST /api/chat`.
3. The backend processes the request (e.g., calls OpenAI API).
4. Response is sent back and displayed in the chat UI.

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` folder for secrets (if using external APIs):

```env
OPENAI_API_KEY=your-api-key
PORT=3000
```

---

## 📆 Build for Production

### Frontend

```bash
cd client
npm run build
```

### Backend

You can serve the built frontend from Express using:

```js
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
```

Then run:

```bash
cd server
node server.js
```

---

## 🧠 Features

* User-friendly chat interface
* Messages stored in memory/state
* Auto-scroll to latest messages
* Role-based UI (user vs. bot)
* Easily extendable with API logic (OpenAI, Rasa, etc.)

---

## 📌 Future Improvements

* Persistent chat history (e.g., DB)
* Authentication (optional)
* Better error handling
* Voice input/output

---

## 📄 License

MIT License
© 2025 Your Name
