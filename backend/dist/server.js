"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("./mongodb");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const genai_1 = require("@google/genai");
const marked_1 = require("marked");
const app = (0, express_1.default)();
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
const db = mongodb_1.client.db("chatbot");
const coll = db.collection("users");
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../frontend/dist")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
}
app.get("/api/chat/history", requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield coll.findOne({ username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username }, { projection: { history: 1, _id: 0 } });
        if (data === null || data === void 0 ? void 0 : data.history) {
            res.json({ message: data.history });
        }
        else {
            res.json({ message: [] });
        }
    }
    catch (e) {
        res.json({ message: ["Error loading messages"] });
    }
}));
app.post("/api/chat/history/delete", requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { historyItemId } = req.body;
    const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
    try {
        yield coll.updateOne({ username: username }, { $pull: { history: { _id: historyItemId } } });
        res.json({ success: true });
    }
    catch (e) {
        console.error("Error deleting history item:", e);
        res.json({ success: false });
    }
}));
app.post("/api/chat/add", requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { historyItemId, message, } = req.body;
    try {
        const user = yield coll.findOne({ username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username }, { projection: { password: 0, _id: 0 } });
        const chatExists = (_b = user === null || user === void 0 ? void 0 : user.history) === null || _b === void 0 ? void 0 : _b.some((item) => item.id == historyItemId);
        if (chatExists) {
            yield coll.updateOne({ username: (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.username, "history.id": historyItemId }, { $push: { "history.$.chatMessages": message } });
        }
        else {
            const title = yield generateTitle(message.content);
            yield coll.updateOne({ username: (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.username }, {
                $push: {
                    history: {
                        chatMessages: [message],
                        title: title,
                        id: historyItemId ? historyItemId : (0, uuid_1.v4)(),
                        date: new Date(),
                    },
                },
            });
        }
        res.status(200).json({ success: true });
    }
    catch (e) {
        res.send("Couldn't add chat item");
    }
}));
function generateTitle(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const prompt = `Generate a title for the given question:${message}. Just output the title and nothing else`;
        try {
            const res = yield ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt,
            });
            return (_a = res.text) !== null && _a !== void 0 ? _a : "";
        }
        catch (e) {
            console.error(e);
            return "New Chat";
        }
    });
}
function getUser(username, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield coll.findOne({ username: username }, { projection: { username: 1, password: 1 } });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return null;
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                return { username: user.username };
            }
            else {
                res.status(401).json({ message: "Incorrect password" });
                return null;
            }
        }
        catch (e) {
            console.error("Not able to fetch user", e);
        }
    });
}
app.get("/api/me", requireLogin, (req, res) => {
    if (req.session.user) {
        res.send({ user: req.session.user });
    }
    else {
        res.status(401).send({ error: "Not logged in" });
    }
});
app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield getUser(username, password, res);
    if (user) {
        req.session.user = { username };
        res.send({ message: "Success" });
    }
}));
app.post("/api/generate", requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { prompt } = req.body;
    try {
        const response = yield ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });
        const markedText = marked_1.marked.parse((_a = response.text) !== null && _a !== void 0 ? _a : "");
        res.json({ message: markedText });
    }
    catch (e) {
        console.error(e);
        res.json({ message: "An error occured. Try again!" });
    }
}));
app.post("/api/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (username && password) {
            const data = yield coll.findOne({ username: username });
            if (data) {
                res.send("User already exists.");
                return;
            }
            yield coll.insertOne({
                username: username,
                password: yield bcrypt_1.default.hash(password, 10),
            });
            res.redirect("/login");
        }
    }
    catch (e) {
        console.error("Error adding user", e);
        res.status(500).send("Error signing up");
    }
}));
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
    res.sendFile(path_1.default.resolve(__dirname, "../../frontend/dist/index.html"));
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongodb_1.test)();
        app.listen(process.env.PORT, () => console.log("Server running"));
    });
}
start();
