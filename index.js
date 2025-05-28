import fetch from 'node-fetch';

const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY_HERE'; // Replace with your key

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: 'URL parameter is required.',
      made_by: 'Pasindu 🇱🇰',
      telegram: '@Pasindu_21',
      channel: 'https://t.me/sl_bjs'
    });
  }

  try {
    // 1. Generate thum.io screenshot URL
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/700/noanimate/${encodeURIComponent(url)}`;

    // 2. Fetch the screenshot image as buffer
    const screenshotResponse = await fetch(screenshotUrl);
    if (!screenshotResponse.ok) throw new Error('Failed to fetch screenshot');

    const buffer = await screenshotResponse.buffer();

    // 3. Upload to ImgBB (multipart/form-data)
    const formData = new FormData();
    formData.append('image', buffer.toString('base64')); // ImgBB expects base64 string
    formData.append('key', IMGBB_API_KEY);

    const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const imgbbResult = await imgbbResponse.json();

    if (!imgbbResult.success) {
      throw new Error('Failed to upload to ImgBB');
    }

    return res.json({
      image_url: imgbbResult.data.url,
      made_by: 'Pasindu 🇱🇰',
      telegram: '@Pasindu_21',
      channel: 'https://t.me/sl_bjs'
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Internal Server Error',
      made_by: 'Pasindu 🇱🇰'
    });
  }
}
