export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing contentId" });
    }

    // Step 1: get GoFile server
    const serverRes = await fetch("https://api.gofile.io/getServer");
    const serverData = await serverRes.json();
    const server = serverData.data.server;

    // Step 2: get content
    const contentRes = await fetch(
      `https://${server}.gofile.io/getContent?contentId=${id}`
    );
    const data = await contentRes.json();

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "GoFile fetch failed" });
  }
}
