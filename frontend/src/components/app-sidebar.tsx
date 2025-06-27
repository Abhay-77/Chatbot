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
import { MdAccountCircle } from "react-icons/md";

export default function AppSidebar() {
  const menuItems = [
    { name: "New chat", icon: HiPencil },
    { name: "Search", icon: CiSearch },
  ];
  const historyData = [
    { id: 1, name: "Login", time: "2025-06-25 10:23 AM" },
    { id: 2, name: "Viewed Dashboard", time: "2025-06-25 10:25 AM" },
    { id: 3, name: "Edited Profile", time: "2025-06-25 10:30 AM" },
    { id: 4, name: "Logged Out", time: "2025-06-25 10:45 AM" },
    { id: 5, name: "Login", time: "2025-06-26 09:05 AM" },
    { id: 6, name: "Viewed Settings", time: "2025-06-26 09:10 AM" },
    { id: 7, name: "Updated Password", time: "2025-06-26 09:15 AM" },
    { id: 8, name: "Logged Out", time: "2025-06-26 09:20 AM" },
    { id: 9, name: "Login", time: "2025-06-26 10:00 AM" },
    { id: 10, name: "Viewed Reports", time: "2025-06-26 10:10 AM" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-between px-4">
        <div className="flex gap-2 items-center">
          <img src="/logo.png" alt="logo" className="size-8 rounded-full" />
          <h1 className="text-xl font-medium">Chatbot</h1>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>New chat</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="flex gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200"
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
              {historyData.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200"
                >
                  <h2 className="">{item.name}</h2>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-300">
        <SidebarMenu>
          <div className="flex gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200">
            <MdAccountCircle size={20} />
            <h2 className="">Account</h2>
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarFooter />
    </Sidebar>
  );
}
