import type { Key } from "react";

export type chatMessageType = {
  content: string | null;
  role: "user" | "bot";
  id: Key;
  time: string;
};
