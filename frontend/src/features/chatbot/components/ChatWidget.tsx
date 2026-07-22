"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatbot } from "../hooks/useChatbot";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const { messages, sendMessage, isSending } = useChatbot();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <span className="font-display text-sm font-medium">Asistente Hoja de Parra Spitz</span>
            <button onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.text}
                </span>
                {message.suggestedProducts && message.suggestedProducts.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {message.suggestedProducts.map((product) => (
                      <li key={product.id} className="rounded border border-border p-2 text-left text-xs">
                        {product.name} — S/ {product.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {isSending && <p className="text-xs text-muted-foreground">Escribiendo...</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isSending}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}

      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir chat"
      >
        <MessageCircle />
      </Button>
    </div>
  );
}
