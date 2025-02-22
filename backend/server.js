import express from "express";
import axios from "axios";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] })); 
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("swagger.json"), "utf8"));

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

let cachedNews = {};
const clients = new Set(); // Track connected clients

const fetchNews = async (category = "general") => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: { category, country: "us", apiKey: NEWS_API_KEY },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

// **Update News Cache**
const updateNewsCache = async () => {
  const categories = ["general", "technology", "business", "sports"];
  for (const category of categories) {
    cachedNews[category] = await fetchNews(category);
  }
  console.log("📰 News cache updated");

  clients.forEach((socket) => {
    if (socket.connected) {
      socket.emit("newsUpdate", cachedNews);
    }
  });
};

// **Socket.io Connection**
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  clients.add(socket);

  socket.emit("newsUpdate", cachedNews); // Send current news on connection

  socket.on("subscribeCategory", (category) => {
    if (cachedNews[category]) {
      socket.emit("newsUpdate", cachedNews[category]);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    clients.delete(socket);
  });
});

// **API Routes**
app.get("/api/news", async (req, res) => {
  const category = req.query.category || "general";
  res.json(cachedNews[category] || []);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  updateNewsCache();
  setInterval(updateNewsCache, 15000);
});
