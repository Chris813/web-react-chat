import { sendMessage } from "@api/conversations";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";

const Form = ({ conversationId }: { conversationId: string | undefined }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue("message", "", { shouldValidate: true });
    await sendMessage(conversationId as string, data.message);
  };
  return (
    <div className=' p-4 bg-white border-t flex items-center gape-2 w-full'>
      <HiPhoto size={30} className=' text-sky-500 mr-4' />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=' flex items-center gpa-2 lg:gap-4 w-full'>
        <MessageInput
          placeholder='输入消息...'
          id='message'
          register={register}
          errors={errors}
          required
        />
        <button
          type='submit'
          className=' rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'>
          <HiPaperAirplane size={20} className=' text-white' />
        </button>
      </form>
    </div>
  );
};

export default Form;
