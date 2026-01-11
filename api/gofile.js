export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
  };

  // Known GoFile servers (fallback list)
  const servers = [
    "store1",
    "store2",
    "store3",
    "store4",
    "store5",
    "store6"
  ];

  try {
    for (const server of servers) {
      try {
        const r = await fetch(
          `https://${server}.gofile.io/getContent?contentId=${id}`,
          { headers }
        );

        const text = await r.text();

        // Skip non-JSON responses
        if (!text.startsWith("{")) continue;

        const data = JSON.parse(text);

        if (data.status === "ok") {
          return res.status(200).json(data);
        }
      } catch (_) {
        // try next server
      }
    }

    return res.status(404).json({
      error: "File not found on GoFile servers"
    });

  } catch (err) {
    return res.status(500).json({
      error: "GoFile fetch failed",
      details: err.toString()
    });
  }
}
