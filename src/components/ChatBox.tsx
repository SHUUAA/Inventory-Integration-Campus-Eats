import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import ProfilePic from "../helpers/ProfilePic";
import * as Avatar from "@radix-ui/react-avatar";
import { authentication } from "../firebase/Config";
const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
}); // Initialize Groq client

export default function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userImage = ProfilePic();
  const name = authentication.currentUser?.displayName;
  const [firstName, surname] = name.split(" ");
  const initials =
    firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
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
          <h2 className="font-semibold text-lg tracking-tight">Campus Chatbot</h2>
          <p className="text-sm text-[#6b7280] leading-3">
            Powered by Groq & Llama3 
          </p>
        </div>
        <div className="h-[460px] overflow-y-auto pr-1 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 my-4 text-gray-600 rounded-lg p-4 text-sm flex-1 ${
                m.role === "user" ? "justify-end" : ""
              }`}
            >
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                {m.role === "user" ? (
                  <Avatar.Root className="inline-flex h-[35px] w-[35px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                    <Avatar.AvatarImage
                      className="h-full w-full rounded-[inherit] object-cover"
                      src={userImage}
                      alt="Profile"
                    />
                    <Avatar.Fallback
                      className="text-red-950 leading-1 flex h-[45px] w-[45px] items-center justify-center bg-brown-950 rounded-full text-[15px] font-medium"
                      delayMs={600}
                    >
                      {initials}
                    </Avatar.Fallback>
                  </Avatar.Root>
                ) : (
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
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                )}
              </span>

              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">
                  {m.role === "user" ? "You" : "Campus AI"}
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
