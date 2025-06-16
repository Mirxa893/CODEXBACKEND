export default async function handler(req, res) {
  const userMessage = req.body.message || "";

  try {
    const response = await fetch("https://mirxakamran893-codexmknew.hf.space/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [userMessage, []] })
    });

    const result = await response.json();
    const reply = result.data[0];
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "❌ Error: " + err.message });
  }
}
