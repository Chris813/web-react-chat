import React, { useState } from "react";
import Modal from "./modal";
import { User } from "@api/auth/types";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { creatConversation } from "@api/conversations";
import toast from "react-hot-toast";
import { Input } from "@components/basic/inputs/Input";
import Select from "@components/basic/inputs/Select";
import { Button } from "@components/basic/inputs/Button";
// import { Button } from "@components/basic/inputs/Button";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}
const GroupChatModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });
  const members = watch("members");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    setIsLoading(true);
    creatConversation({ ...data, isGroup: true })
      .then((res) => {
        console.log(res);
        onClose();
        window.location.reload();
      })
      .catch(() => {
        toast.error("创建失败");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Modal isOpen={isOpen as boolean} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=' space-y-12'>
          <div className=' border-b border-gray-900/10 pb-4'>
            <h2 className=' text-base font-semibold leading-7 text-gray-900'>
              创建一个群组聊天
            </h2>
            <p className=' mt-1 text-sm leading-6 text-gray-600'>
              创建一个群组聊天，邀请其他人加入。
            </p>
            <div className=' mt-5 flex flex-col gap-y-8'>
              <Input
                id='name'
                label='群聊名'
                register={register}
                disabled={isLoading}
                required
                errors={errors}
              />
              <Select
                disabled={isLoading}
                label='群聊成员'
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value: string[]) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className=' mt-5 flex flex-row-reverse'>
          <Button disabled={isLoading} type='submit'>
            创建
          </Button>
          <Button
            onClick={onClose}
            secondary
            disabled={isLoading}
            type='button'>
            取消
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
