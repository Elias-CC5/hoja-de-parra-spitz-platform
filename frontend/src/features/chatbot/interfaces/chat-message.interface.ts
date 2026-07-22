export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  suggestedProducts?: { id: string; name: string; price: number }[];
}
