import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Pi Network Auth Validation Endpoint
  app.post("/api/auth/pi", async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    try {
      // Validate token with Pi Network API
      const response = await axios.get("https://api.minepi.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // If successful, establish session (mocked here as returning user data)
      const userData = response.data;
      res.json({
        success: true,
        user: {
          uid: userData.uid,
          username: userData.username,
        },
      });
    } catch (error: any) {
      console.error("Pi Auth Error:", error.response?.data || error.message);
      res.status(401).json({ error: "Invalid access token" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
