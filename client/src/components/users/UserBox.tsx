import { User } from "@api/auth/types";
import { creatConversation } from "@api/conversations";
import Avatar from "@components/Avatar";
import LoadingModal from "@components/modal/LoadingModal";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserBoxProps {
  data: User;
  isOnline?: boolean;
}

const UserBox = ({ data, isOnline }: UserBoxProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    setIsLoading(true);
    //获取与该用户的通话记录显示在右侧
    console.log(`和${data.name}开始聊天`);
    creatConversation({ userId: data.id })
      .then((res) => {
        navigate(`/chat/conversation/${res.data.data.conversation.id}`);
      })

      .finally(() => setIsLoading(false));
  }, [data, navigate]);
  useEffect(() => {
    console.log(data.name, isOnline);
  }, [data, isOnline]);
  return (
    <div>
      {isLoading && <LoadingModal />}
      <div
        className='flex items-center space-x-3 p-3 cursor-pointer hover:bg-neutral-100 transition rounded-lg '
        onClick={handleClick}>
        {data && <Avatar user={data} isOnline={isOnline} />}
        <div className='flex-1 min-w-0'>
          <p className='text-base font-medium text-gray-900 truncate'>
            {data?.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
