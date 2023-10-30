import { deleteConversation } from "@api/conversations";
import { Button } from "@components/basic/inputs/Button";
import Modal from "@components/modal/modal";
import { Dialog } from "@headlessui/react";
import useConversation from "@hooks/useConversation";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { conversationId } = useConversation();
  const onDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await deleteConversation(conversationId as string);
      onClose();
      navigate("/chat/conversation");
      window.location.reload();
    } catch (error) {
      toast.error("删除失败");
    } finally {
      setIsLoading(false);
    }
  }, [onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className=' flex'>
        <div className=' flex bg-red-100 rounded-full h-12 w-12 items-center justify-center'>
          <FiAlertTriangle className=' h-6 w-6 text-red-600' />
        </div>
        <div className=' m-3'>
          <Dialog.Title
            as='h3'
            className=' text-base font-semibold leading-6 text-gray-900'>
            删除聊天
          </Dialog.Title>
          <div className=' mt-2'>
            <p className=' text-sm text-gray-500'>
              确定要删除该聊天吗？删除后无法恢复
            </p>
          </div>
        </div>
      </div>
      <div className=' mt-5 flex flex-row-reverse'>
        <Button disabled={isLoading} danger onClick={onDelete}>
          删除
        </Button>
        <Button onClick={onClose} secondary>
          取消
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
