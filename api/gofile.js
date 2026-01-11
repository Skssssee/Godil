export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
  };

  async function fetchFolder(contentId) {
    const apiUrl =
      `https://api.gofile.io/getContent` +
      `?contentId=${contentId}` +
      `&websiteToken=public` +
      `&cache=true`;

    const r = await fetch(apiUrl, { headers });
    const text = await r.text();

    if (!text.startsWith("{")) return [];

    const data = JSON.parse(text);
    if (data.status !== "ok") return [];

    const items = Object.values(data.data.contents);
    let files = [];

    for (const item of items) {
      if (item.type === "file") {
        files.push(item);
      }
      if (item.type === "folder") {
        const nested = await fetchFolder(item.id);
        files = files.concat(nested);
      }
    }

    return files;
  }

  try {
    const allFiles = await fetchFolder(id);

    if (!allFiles.length) {
      return res.status(404).json({ error: "No files found in folder" });
    }

    return res.status(200).json({
      status: "ok",
      total: allFiles.length,
      files: allFiles
    });

  } catch (err) {
    return res.status(500).json({
      error: "GoFile fetch failed",
      details: err.toString()
    });
  }
        }
