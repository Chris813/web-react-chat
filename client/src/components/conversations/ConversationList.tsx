import { ConversationProp } from "@api/conversations/types";
import useConversation from "@hooks/useConversation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import CoversationBox from "./CoversationBox";

interface ConversationListProps {
  initialItems: ConversationProp[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  // const { value } = useArray(initialItems);
  // console.log(initialItems);
  // console.log(value);
  // const navigate = useNavigate();
  const { isOpen, conversationId } = useConversation();
  return (
    <aside
      className={clsx(
        ` fixed lg:w-80 w-full border-r border-gray-200`,
        isOpen ? "hidden" : "block h-full"
      )}>
      <div className=' px-5'>
        <div className=' flex justify-between mb-4 pt-4'>
          <div className=' text-2xl font-bold text-neutral-800'>聊天</div>
          <div className=' rounded-full p-2 text-gray-600 bg-gray-100 cursor-pointer hover:opacity-75 transition'>
            <MdOutlineGroupAdd size={20} />
          </div>
        </div>
        {initialItems.map((item) => (
          <CoversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
