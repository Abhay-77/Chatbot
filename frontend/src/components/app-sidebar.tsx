import { HiPencil } from "react-icons/hi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "./ui/sidebar";
import { CiSearch } from "react-icons/ci";
import { AccountDetails } from "./Account";
import type { ChatHistory } from "../../../backend/src/shared/types";
import HistoryItemUI from "./HistoryItemUI";

export default function AppSidebar({ history }: { history?: ChatHistory }) {
  const menuItems = [
    { name: "New chat", icon: HiPencil },
    { name: "Search", icon: CiSearch },
  ];
  // const historyData = [
  //   {
  //     id: "1",
  //     title: "Loginaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     date: new Date("2025-06-25T10:23:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "2",
  //     title:
  //       "Viewed Dashboard aaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaa",
  //     date: new Date("2025-06-25T10:25:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "3",
  //     title: "Edited Profileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     date: new Date("2025-06-25T10:30:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "4",
  //     title: "Logged Out",
  //     date: new Date("2025-06-25T10:45:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "5",
  //     title: "Login",
  //     date: new Date("2025-06-26T09:05:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "6",
  //     title: "Viewed Settings",
  //     date: new Date("2025-06-26T09:10:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "7",
  //     title: "Updated Password",
  //     date: new Date("2025-06-26T09:15:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "8",
  //     title: "Logged Out",
  //     date: new Date("2025-06-26T09:20:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "9",
  //     title: "Login",
  //     date: new Date("2025-06-26T10:00:00"),
  //     chatMessages: [],
  //   },
  //   {
  //     id: "10",
  //     title: "Viewed Reports",
  //     date: new Date("2025-06-26T10:10:00"),
  //     chatMessages: [],
  //   },
  // ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-between px-4">
        <div className="flex gap-2 items-center">
          <img src="/logo.png" alt="logo" className="size-8 rounded-full" />
          <h1 className="text-xl font-medium cursor-default">Chatbot</h1>
        </div>
        <SidebarTrigger className="hover:bg-neutral-200" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>New chat</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="flex cursor-default gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200"
                >
                  <item.icon size={20} />
                  <h2 className="">{item.name}</h2>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {history ? (
                history.map((item) => (
                  <HistoryItemUI key={item.id} item={item} />
                ))
              ) : (
                <h2 className="text-lg p-2 w-full text-medium text-neutral-700">
                  No history
                </h2>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-300">
        <SidebarMenu>
          <AccountDetails />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarFooter />
    </Sidebar>
  );
}
