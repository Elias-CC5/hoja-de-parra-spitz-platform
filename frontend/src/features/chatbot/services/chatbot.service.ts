import { api } from "@/lib/axios";

interface ChatbotReply {
  reply: string;
  suggestedProducts?: { id: string; name: string; price: number }[];
}

export const chatbotService = {
  sendMessage: (message: string) => api.post<never, ChatbotReply>("/chatbot/message", { message }),
};
