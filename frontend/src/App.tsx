import clsx from "clsx";
import AppSidebar from "./components/app-sidebar";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { FaArrowUp } from "react-icons/fa";

function ConditionalTrigger() {
  const { state } = useSidebar();
  console.log(state)
  if (state == "collapsed" || window.innerWidth < 768) {
    return <SidebarTrigger className="absolute" />;
  }
  return null;
}

const App = () => {
  const chatMessages = [
    { id: 1, role: "user", content: "Hi there!", time: "10:00 AM" },
    {
      id: 2,
      role: "bot",
      content: "Hello! How can I help you today?",
      time: "10:00 AM",
    },
    {
      id: 3,
      role: "user",
      content: "What’s the weather like today?",
      time: "10:01 AM",
    },
    {
      id: 4,
      role: "bot",
      content: "It's sunny and 28°C in your location.",
      time: "10:01 AM",
    },
    {
      id: 5,
      role: "user",
      content: "Nice. Can you set a reminder for 2 PM?",
      time: "10:02 AM",
    },
    {
      id: 6,
      role: "bot",
      content: "Sure! Reminder set for 2 PM.",
      time: "10:02 AM",
    },
    {
      id: 7,
      role: "user",
      content: "Thanks. What’s on my to-do list?",
      time: "10:03 AM",
    },
    {
      id: 8,
      role: "bot",
      content:
        "You have 3 tasks: Finish report, Attend meeting at 1 PM, and Call mom.",
      time: "10:03 AM",
    },
    {
      id: 9,
      role: "user",
      content: "Can you mark 'Finish report' as done?",
      time: "10:04 AM",
    },
    {
      id: 10,
      role: "bot",
      content: "✅ 'Finish report' marked as completed.",
      time: "10:04 AM",
    },
    {
      id: 11,
      role: "user",
      content: "What’s the next task?",
      time: "10:05 AM",
    },
    {
      id: 12,
      role: "bot",
      content: "Next task: Attend meeting at 1 PM.",
      time: "10:05 AM",
    },
    {
      id: 13,
      role: "user",
      content: "Remind me 10 minutes before the meeting.",
      time: "10:06 AM",
    },
    {
      id: 14,
      role: "bot",
      content: "Got it. I’ll remind you at 12:50 PM.",
      time: "10:06 AM",
    },
    {
      id: 15,
      role: "user",
      content: "Awesome. You're the best!",
      time: "10:07 AM",
    },
  ];
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="text-neutral-800 z-50 bg-white h-screen w-screen">
        <ConditionalTrigger />
        <section className="bg-neutral-100 py-6 px-4 h-full flex flex-col justify-end">
          <ScrollArea className="max-h-[90%] p-2">
            {chatMessages.map((mess) => (
              <p
                key={mess.id}
                className={clsx(
                  `bg-neutral-300 hover:bg-neutral-200 rounded-lg min-h-12 p-1
                max-w-[40vw] text-wrap m-2 flex items-center`,
                  { "justify-self-end": mess.role == "user" }
                )}
              >
                {mess.content}
              </p>
            ))}
          </ScrollArea>
          <div className="relative">
            <Input
              className="bg-neutral-300 min-h-12 rounded-lg"
              placeholder="Ask anything"
            />
            <Button
              variant="secondary"
              size="icon"
              className="size-8 absolute bottom-2 right-2 bg-neutral-400"
            >
              <FaArrowUp />
            </Button>
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
};

export default App;
