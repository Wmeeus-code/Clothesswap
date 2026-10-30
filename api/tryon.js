export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_TOKEN = process.env.REPLICATE_API_TOKEN;

  // Status check (GET verzoek)
  if (req.method === 'GET') {
    const { getUrl } = req.query;
    if (!getUrl) return res.status(400).json({ error: 'Missing getUrl' });

    try {
      const response = await fetch(getUrl, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Start verzoek (POST verzoek met de actieve IDM-VTON versie)
  if (req.method === 'POST') {
    try {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          version: "c87eec610ab5800070c58977739717d121542dded30f2bb00337c1a84f392289",
          input: {
            crop: false,
            seed: 42,
            category: "upper_body",
            force_dc: false,
            garm_img: req.body.input.garm_img,
            human_img: req.body.input.human_img,
            mask_img: "https://raw.githubusercontent.com/yisol/IDM-VTON/main/example/densepose/00008_00.png",
            garment_des: "clothing"
          }
        })
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
