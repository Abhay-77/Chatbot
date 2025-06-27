export type ChatMessageType = {
  content: string | null;
  role: "user" | "bot";
  id: string;
  time: string;
};

export type ChatHistoryItem = {
  id: string;
  title: string;
  chatMessages: ChatMessageType[];
};

export type ChatHistory = ChatHistoryItem[];

export type User = {
  username: string;
  password: string;
  history?: ChatHistory;
};
