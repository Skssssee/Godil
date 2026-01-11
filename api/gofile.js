export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const headers = {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    };

    // 1️⃣ Get GoFile server
    const serverRes = await fetch(
      "https://api.gofile.io/getServer",
      { headers }
    );
    const serverData = await serverRes.json();

    if (serverData.status !== "ok") {
      return res.status(500).json({ error: "Server fetch failed" });
    }

    const server = serverData.data.server;

    // 2️⃣ Get file data
    const contentRes = await fetch(
      `https://${server}.gofile.io/getContent?contentId=${id}`,
      { headers }
    );
    const contentData = await contentRes.json();

    return res.status(200).json(contentData);

  } catch (e) {
    return res.status(500).json({
      error: "GoFile fetch failed",
      details: e.toString()
    });
  }
}
