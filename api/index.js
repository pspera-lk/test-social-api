import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed. Use GET.",
      made_by: "Pasindu 🇱🇰"
    });
  }

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({
      error: "URL parameter is required.",
      made_by: "Pasindu 🇱🇰",
      telegram: "@Pasindu_21",
      channel: "https://t.me/sl_bjs"
    });
  }

  try {
    const thumioUrl = `https://image.thum.io/auth/74245/fullpage/${encodeURIComponent(targetUrl)}`;

    const screenshotResponse = await fetch(thumioUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VercelNode/1.0)",
        "Referer": "https://ww5.123moviesfree.net"
      }
    });

    if (!screenshotResponse.ok) {
      throw new Error("Failed to fetch screenshot from thum.io");
    }

    const imageBuffer = await screenshotResponse.arrayBuffer();

    const form = new FormData();
    form.append("file", Buffer.from(imageBuffer), { filename: "screenshot.png" });

    const uploadResponse = await fetch("https://0x0.st", {
      method: "POST",
      body: form
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to 0x0.st");
    }

    const uploadedUrl = (await uploadResponse.text()).trim();

    return res.json({
      image_url: uploadedUrl,
      made_by: "Pasindu 🇱🇰",
      telegram: "@Pasindu_21",
      channel: "https://t.me/sl_bjs"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unknown error",
      made_by: "Pasindu 🇱🇰"
    });
  }
}
