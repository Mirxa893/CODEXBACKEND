import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const formData = new FormData();
    formData.append("message", input);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Error: " + err.message },
      ]);
    }

    setFile(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        CODEX Chatbot
      </h1>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 space-y-4">
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <img
                  src="/robot-icon.png"
                  className="w-8 h-8 rounded-full"
                  alt="bot"
                />
              )}
              <div
                className={`p-3 rounded-lg text-sm max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <img
                  src="/user-icon.png"
                  className="w-8 h-8 rounded-full"
                  alt="user"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
          />
          <input
            type="text"
            className="flex-grow p-2 border rounded-md w-full"
            value={input}
            placeholder="Type your message"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
