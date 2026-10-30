export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_TOKEN = process.env.REPLICATE_API_TOKEN;

  // Status opvragen (GET)
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

  // AI-pasbeurt starten (POST via predictions met specifieke idm-vton hash)
  if (req.method === 'POST') {
    try {
      const humanImg = req.body.input ? req.body.input.human_img : req.body.human_img;
      const garmImg = req.body.input ? req.body.input.garm_img : req.body.garm_img;

      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
          input: {
            crop: false,
            seed: 42,
            category: "upper_body",
            force_dc: false,
            garm_img: garmImg,
            human_img: humanImg,
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
