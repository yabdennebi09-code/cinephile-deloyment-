const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const OpenAI = require("openai");

dotenv.config({ quiet: true });
dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

const app = express();
const port = process.env.PORT || 3001;
const publicDir = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));



app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get(["/style.css", "/script.js", "/config.js"], (req, res) => {
  res.sendFile(path.join(publicDir, req.path));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   SAFE AI IMAGE ROUTE
========================= */
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OpenAI API key is not configured",
        details: "Set OPENAI_API_KEY in your hosting provider's environment variables."
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await client.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: "1024x1536",
      quality: "low"
    });

    const image = response.data?.[0];

    let imageUrl = null;

    if (image?.b64_json) {
      imageUrl = `data:image/png;base64,${image.b64_json}`;
    }

    if (image?.url) {
      imageUrl = image.url;
    }

    if (!imageUrl) {
      throw new Error("No image returned");
    }

    res.json({ imageUrl });

  } catch (error) {
    console.error("AI image generation failed:", error);

    res.status(500).json({
      error: "Image generation failed",
      details: error?.message || "Unknown error"
    });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
