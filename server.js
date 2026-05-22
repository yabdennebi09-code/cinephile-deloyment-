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

// IMPORTANT: frontend folder MUST be "public"
app.use(express.static(path.join(__dirname, "public")));

// =========================
// OPENAI CLIENT
// =========================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// HEALTH CHECK (for Render)
// =========================
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// =========================
// IMAGE GENERATION ROUTE
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

    const imageUrl = image?.url || null;

    if (!imageUrl) {
      throw new Error("No image returned from OpenAI");
    }

    res.json({ imageUrl });

  } catch (err) {
    console.error("Image generation error:", err);

    res.status(500).json({
      error: "Image generation failed",
      details: err.message,
    });
  }
});

// =========================
// FRONTEND FALLBACK ROUTE
// =========================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// START SERVER
// =========================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
