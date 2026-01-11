export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
  };

  try {
    // GoFile OFFICIAL endpoint (folder-safe)
    const apiUrl =
      `https://api.gofile.io/getContent` +
      `?contentId=${id}` +
      `&websiteToken=public` +
      `&cache=true`;

    const r = await fetch(apiUrl, { headers });
    const text = await r.text();

    if (!text.startsWith("{")) {
      return res.status(500).json({
        error: "Invalid GoFile response",
        raw: text
      });
    }

    const data = JSON.parse(text);

    if (data.status !== "ok") {
      return res.status(404).json(data);
    }

    // ✅ FOLDER HANDLING
    const contents = data.data.contents;
    const items = Object.values(contents);

    if (!items.length) {
      return res.status(404).json({ error: "Folder is empty" });
    }

    // pick first file (you can change this later)
    const file = items.find(i => i.type === "file") || items[0];

    return res.status(200).json({
      status: "ok",
      file
    });

  } catch (err) {
    return res.status(500).json({
      error: "GoFile fetch failed",
      details: err.toString()
    });
  }
}
