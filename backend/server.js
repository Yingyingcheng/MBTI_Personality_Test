import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import authRoutes from "./auth.js";
import personalityRoutes from "./personality.js";
import { initDB } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initDB();

// JSON parser middleware
app.use(express.json());

// Configure Vite middleware for React client
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});
app.use(vite.middlewares);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/personality", personalityRoutes);

// Render the React client
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    const template = await vite.transformIndexHtml(
      url,
      fs.readFileSync("./frontend/index.html", "utf-8"),
    );
    const { render } = await vite.ssrLoadModule("./frontend/entry-server.jsx");
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => {
  console.log(`Express server running on *:${port}`);
});
