export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_TOKEN = "r8_TNeojaogU7ytZAfJl1sV8re2hZezQDI0HiC5g";

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
