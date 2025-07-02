import { MdAccountCircle } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export const AccountDetails = () => {
  const [username, setUsername] = useState("Not logged in");
  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user.username);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchUsername();
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200">
          <MdAccountCircle size={20} />
          <h2 className="">{username}</h2>
        </div>
      </PopoverTrigger>
      <PopoverContent className="cursor-default">
        <div className="p-1 text-lg">{username}</div>
        <form action="/api/logout" method="post">
          <Button type="submit" className="bg-neutral-700 cursor-pointer">
            Logout
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
