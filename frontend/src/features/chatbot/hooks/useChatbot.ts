"use client";

import { useState } from "react";
import { chatbotService } from "../services/chatbot.service";
import type { ChatMessage } from "../interfaces/chat-message.interface";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "¡Hola! Soy el asistente de Hoja de Parra Spitz. Puedo ayudarte con productos, servicios, pedidos, reservas y horarios.",
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const reply = await chatbotService.sendMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: reply.reply,
          suggestedProducts: reply.suggestedProducts,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "No pude procesar tu mensaje en este momento. Intenta nuevamente.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending };
}
