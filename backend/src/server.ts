import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import { test, client } from "./mongodb";

const app = express();

const db = client.db("chatbot");
const coll = db.collection("users");

app.use(cors());
app.use(express.json());
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
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

app.get("/", requireLogin, (req, res) => {
  res.send("Home page " + req.session.user?.username);
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
  app.listen(3000, () => console.log("Server running"));
}

start();
