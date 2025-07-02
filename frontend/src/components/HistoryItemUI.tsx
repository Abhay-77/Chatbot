import { MdOutlineDelete } from "react-icons/md";
import type { ChatHistoryItem } from "../../../shared/types";

const HistoryItemUI = ({ item }: { item: ChatHistoryItem }) => {
  return (
    <div
      key={item.id}
      className="flex gap-2 items-center w-full rounded-md p-2 hover:bg-neutral-200 justify-between cursor-pointer"
    >
      <h2 className="max-w-[90%] truncate" title={item.title}>
        {item.title}
      </h2>
      <form
        action="/chat/delete"
        method="post"
        className="flex items-center hover:bg-neutral-400 rounded-md"
      >
        <input type="hidden" value={item.id} name="id" />
        <button type="submit">
          <MdOutlineDelete className="cursor-pointer m-1" size={20} />
        </button>
      </form>
    </div>
  );
};

export default HistoryItemUI;
