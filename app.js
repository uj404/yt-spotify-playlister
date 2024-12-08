const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Route to fetch YouTube playlist data
app.get("/youtube-playlist", async (req, res) => {
  const playlistId = req.query.playlistId; // Get playlist ID from query params
  const apiKey = process.env.YOUTUBE_API_KEY; // Get API key from .env file

  if (!playlistId) {
    return res.status(400).send({ error: "Playlist ID is required" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: 50, // Fetch up to 50 items
          key: apiKey,
        },
      }
    );

    const items = response.data.items;
    const songTitles = items.map((item) => {
      const title = item.snippet.title;
      return title;
    }); // Extract song titles

    res.status(200).send({ songs: songTitles });
  } catch (error) {
    console.error(
      "Error fetching playlist:",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Failed to fetch playlist data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
