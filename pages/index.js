import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages([...messages, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();

    setMessages((msgs) => [...msgs, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-xl font-bold mb-4 text-center">🤖 CODEX Mirxa Kamran</h1>

        <div className="h-[400px] overflow-y-auto space-y-3 mb-4 bg-gray-50 p-3 rounded">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-sm max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-500">Assistant is typing...</div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow p-2 rounded border border-gray-300"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://wa.me/923390320120"
            className="inline-block mt-4 text-green-600 font-semibold"
            target="_blank"
          >
            💬 Chat with human on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
