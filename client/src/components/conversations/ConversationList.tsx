import { ConversationProp } from "@api/conversations/types";
import useConversation from "@hooks/useConversation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import CoversationBox from "./CoversationBox";
import GroupChatModal from "@components/modal/GroupChatModal";
import { User } from "@api/auth/types";
import { useMemo, useState } from "react";

interface ConversationListProps {
  initialItems: ConversationProp[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  // const { value } = useArray(initialItems);
  // console.log(initialItems);
  // console.log(value);
  // const navigate = useNavigate();
  const { conversationId } = useConversation();
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const conversation = useMemo(() => initialItems, [initialItems]);
  const isOpen = useMemo(
    () => conversation.map((item) => item.id === conversationId),
    [conversationId, conversation]
  );
  return (
    <>
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          ` fixed lg:w-80 w-full border-r border-gray-200 h-full max-lg:hidden`
          // isOpen ? "hidden" : "block h-full"
        )}>
        <div className=' px-5'>
          <div className=' flex justify-between mb-4 pt-4'>
            <div className=' text-2xl font-bold text-neutral-800'>聊天</div>
            <div
              className=' rounded-full p-2 text-gray-600 bg-gray-100 cursor-pointer hover:opacity-75 transition'
              onClick={() => setGroupModalOpen(true)}>
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversation.map((item, index) => (
            <CoversationBox
              key={index}
              data={item}
              selected={conversationId === item.id}
              isOpen={isOpen[index]}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
