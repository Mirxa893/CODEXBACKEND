import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = "qwen/qwen-2.5-coder-32b-instruct:free";

  const form = new formidable.IncomingForm({ maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    const userMessage = fields.message || "";
    let fileContext = "";

    if (files.file) {
      const file = files.file[0];
      const buffer = fs.readFileSync(file.filepath);
      if (file.mimetype === "application/pdf") {
        const parsed = await pdfParse(buffer);
        fileContext = parsed.text;
      } else {
        fileContext = buffer.toString("utf-8");
      }
    }

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant. Use the uploaded file if needed.",
      },
      {
        role: "user",
        content: `${userMessage}\n\n[Uploaded File Content]\n${fileContext}`,
      },
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response";

      res.status(200).json({ reply });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
