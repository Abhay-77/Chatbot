import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import { test, client } from "./mongodb";
import { ChatHistoryItem, ChatMessageType, User } from "../../shared/types";
import { Collection } from "mongodb";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

const app = express();
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const db = client.db("chatbot");
const coll: Collection<User> = db.collection("users");

app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    user?: {
      username: string;
    };
  }
}

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

app.get("/api/chat/history", requireLogin, async (req, res) => {
  try {
    const data = await coll.findOne(
      { username: req.session.user?.username },
      { projection: { history: 1, _id: 0 } }
    );
    if (data?.history) {
      res.json({ message: data.history });
    } else {
      res.json({ message: [] });
    }
  } catch (e) {
    res.json({ message: ["Error loading messages"] });
  }
});

app.post("/api/chat/history/delete", requireLogin, async (req, res) => {
  const { historyItemId } = req.body;
  const username = req.session.user?.username;
  try {
    await coll.updateOne(
      { username: username },
      { $pull: { history: { _id: historyItemId } } }
    );
    res.json({ success: true });
  } catch (e) {
    console.error("Error deleting history item:", e);
    res.json({ success: false });
  }
});

app.post("/api/chat/add", requireLogin, async (req, res) => {
  const {
    historyItemId,
    message,
  }: { historyItemId: string; message: ChatMessageType } = req.body;
  try {
    const user = await coll.findOne(
      { username: req.session.user?.username },
      { projection: { password: 0, _id: 0 } }
    );
    const chatExists = user?.history?.some(
      (item: ChatHistoryItem) => item.id == historyItemId
    );
    if (chatExists) {
      await coll.updateOne(
        { username: req.session.user?.username, "history.id": historyItemId },
        { $push: { "history.$.chatMessages": message } }
      );
    } else {
      const title: string = await generateTitle(message.content);
      await coll.updateOne(
        { username: req.session.user?.username },
        {
          $push: {
            history: {
              chatMessages: [message],
              title: title,
              id: historyItemId ? historyItemId : uuid(),
              date: new Date(),
            },
          },
        }
      );
    }
    res.status(200).json({ success: true });
  } catch (e) {
    res.send("Couldn't add chat item");
  }
});

async function generateTitle(message: string): Promise<string> {
  const prompt = `Generate a title for the given question:${message}. Just output the title and nothing else`;
  try {
    const res = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    return res.text ?? "";
  } catch (e) {
    console.error(e);
    return "New Chat";
  }
}

async function getUser(username: string, password: string, res: Response) {
  try {
    const user = await coll.findOne(
      { username: username },
      { projection: { username: 1, password: 1 } }
    );
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return { username: user.username };
    } else {
      res.status(401).json({ message: "Incorrect password" });
      return null;
    }
  } catch (e) {
    console.error("Not able to fetch user", e);
  }
}

app.get("/api/me", requireLogin, (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "Not logged in" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username, password, res);
  if (user) {
    req.session.user = { username };
    res.send({ message: "Success" });
  }
});

app.post("/api/generate", requireLogin, async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    const markedText = marked.parse(response.text ?? "");
    res.json({ message: markedText });
  } catch (e) {
    console.error(e);
    res.json({ message: "An error occured. Try again!" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const data = await coll.findOne({ username: username });
      if (data) {
        res.send("User already exists.");
        return;
      }
      await coll.insertOne({
        username: username,
        password: await bcrypt.hash(password, 10),
      });
      res.redirect("/login");
    }
  } catch (e) {
    console.error("Error adding user", e);
    res.status(500).send("Error signing up");
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session token", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
});

async function start() {
  await test();
  app.listen(process.env.PORT, () => console.log("Server running"));
}

start();
