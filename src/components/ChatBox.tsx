import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

const groq = new Groq({ apiKey: import.meta.env.VITE_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true }); // Initialize Groq client

export default function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const newMessages = [
      ...messages,
      ...(e ? [{ role: "user", content: input, name: "user" }] : []), // Add user message with name
    ];
    setMessages(newMessages);
    setInput(""); // Clear input field

    try {
      const stream = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: newMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "assistant") {
            return prev.slice(0, -1).concat({
              ...lastMessage,
              content: lastMessage.content + token,
            });
          } else {
            return [
              ...prev,
              { role: "assistant", content: token, name: "assistant" },
            ]; // Add assistant message with name
          }
        });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 right-0 ${isOpen ? "block" : "hidden"}`}>
      <div
        style={{
          boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          position: "fixed",
          bottom: "calc(4rem + 1.5rem)",
          right: 0,
          marginRight: "1rem",
          backgroundColor: "#FFFAF1",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          width: "440px",
          height: "634px",
        }}
      >
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
          <p className="text-sm text-[#6b7280] leading-3">
            You're my sunshine.
          </p>
        </div>
        <div className="min-h-[460px] max-h-[460px] overflow-y-auto pr-1 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 my-4 text-gray-600  rounded-lg p-4  text-sm flex-1 ${
                m.role === "user" ? "justify-end" : ""
              }`}
            >
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">
                  {m.role === "user" ? "You" : "AI"}
                </span>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <p className="leading-relaxed">Typing...</p>
            </div>
          )}
        </div>
        <div className="flex items-center pt-0">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center justify-center w-full space-x-2"
          >
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={input}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[black] disabled:pointer-events-none bg-red-950 hover:bg-red-950 h-10 px-4 py-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
