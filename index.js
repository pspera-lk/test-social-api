const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ status: "error", message: "Missing 'url' parameter" });
  }

  exec(`yt-dlp -j "${videoUrl}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ status: "error", message: stderr });
    }

    try {
      const json = JSON.parse(stdout);
      const result = {
        title: json.title,
        duration: json.duration,
        thumbnail: json.thumbnail,
        formats: json.formats.map(f => ({
          quality: f.format_note,
          ext: f.ext,
          url: f.url,
          filesize: f.filesize
        })),
        developer: "Pasindu 🇱🇰",
        telegram: "@Pasindu_21",
        channel: "https://t.me/sl_bjs"
      };
      res.json(result);
    } catch (e) {
      res.status(500).json({ status: "error", message: "yt-dlp output error" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`yt-dlp API is running on port ${PORT}`));
