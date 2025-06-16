export default async function handler(req, res) {
  const userMessage = req.body.message || "";

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = "qwen/qwen-2.5-coder-32b-instruct:free";

  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: userMessage,
    }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages
      })
    });

    const result = await response.json();
    const reply = result?.choices?.[0]?.message?.content || "❌ No response from OpenRouter.";
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "❌ Error: " + err.message });
  }
}
