"use client";

import { useState, useRef, useEffect } from "react";
import { generateResponse } from "@/lib/gemini";
import { Send, Loader2 } from "lucide-react"; // Using Lucide icons for better visuals

type Message = {
  content: string;
  role: "user" | "assistant";
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { content: input, role: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        content: response,
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <h1 className="text-xl font-semibold">Personal Assistant</h1>
        <p className="text-sm opacity-90">Ask me anything</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">Start a conversation</h3>
            <p className="max-w-xs">Type a message to begin chatting with me</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2 w-full items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`
              flex-1 min-w-0
              border border-gray-300 
              rounded-full px-5 py-3
              focus:outline-none 
              focus:ring-2 focus:ring-blue-500
              focus:border-transparent
              bg-white
              text-gray-800
              placeholder-gray-400
              shadow-sm
              transition-all
              ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
            `}
            placeholder={isLoading ? "Processing your message..." : "Type your message..."}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              p-3 rounded-full
              text-white
              transition-all
              ${isLoading || !input.trim() ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
              shadow-md
              flex items-center justify-center
              ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}