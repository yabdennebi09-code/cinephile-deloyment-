const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// =========================
// OPENAI CLIENT
// =========================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// HEALTH CHECK
// =========================
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// =========================
// AI IMAGE ROUTE
// =========================
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY",
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1536",
      quality: "medium",
    });

    const image = response.data?.[0];

    const imageUrl = image?.url;

    if (!imageUrl) {
      throw new Error("No image returned");
    }

    res.json({ imageUrl });

  } catch (err) {
    console.error("AI error:", err);

    res.status(500).json({
      error: "Image generation failed",
      details: err.message,
    });
  }
});

// =========================
// FRONTEND FALLBACK ROUTE (FIXED)
// =========================
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// START SERVER
// =========================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

