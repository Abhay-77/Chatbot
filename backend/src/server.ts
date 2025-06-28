import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import { test, client } from "./mongodb";
import { ChatHistoryItem, User } from "../../shared/types";
import { Collection } from "mongodb";
import { v4 as uuid } from "uuid";
import dotenv from 'dotenv'

const app = express();
dotenv.config()

const db = client.db("chatbot");
const coll: Collection<User> = db.collection("users");

app.use(cors());
app.use(express.json());
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
    console.log("Not logged in");
    res.redirect("/login");
  }
}

app.get("/", requireLogin, async (req, res) => {
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

app.post("/chat/add", async (req, res) => {
  const { historyItemId, message } = req.body;
  try {
    const user = await coll.findOne(
      { username: req.session.user?.username },
      { projection: { password: 0, _id: 0 } }
    );
    const chatExists = user?.history?.some(
      (item: ChatHistoryItem) => item.id == historyItemId
    );
    console.log(chatExists);
    if (chatExists) {
      await coll.updateOne(
        { username: req.session.user?.username, "history.id": historyItemId },
        { $push: { "history.$.chatMessages": message } }
      );
    } else {
      await coll.updateOne(
        { username: req.session.user?.username },
        {
          $push: {
            history: {
              chatMessages: [message],
              title: "New chat",
              id: uuid(),
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

async function getUser(username: string, password: string) {
  try {
    const user = await coll.findOne({ username: username });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  } catch (e) {
    console.log("Not able to fetch user", e);
  }
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username, password);
  console.log(user);
  if (user) {
    req.session.user = { username };
    console.log("Logged in");
    res.send("Logged in");
  } else {
    res.send("Invalid credentials");
  }
});

app.post("/signup", async (req, res) => {
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
      res.send("Signed up");
    }
  } catch (e) {
    console.log("Error adding user", e);
    res.send("Error signing up");
  }
});

app.get("/login", (req, res) => {
  res.send("Please login");
});

app.get("/signup", (req, res) => {
  res.send("Please signup");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session token", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

async function start() {
  await test();
  app.listen(process.env.PORT, () => console.log("Server running"));
}

start();
