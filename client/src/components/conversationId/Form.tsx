import { sendMessage } from "@api/conversations";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";
import { ChangeEvent } from "react";

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
    await sendMessage(conversationId as string, { text: data.message });
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // 获取用户选择的文件
    const file = event.target.files?.[0] as File;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        // 读取完成后，将结果赋值给 img
        const img = reader.result as string;
        console.log(img);
        await sendMessage(conversationId as string, { image: img });
      };
    }
  };

  return (
    <div className=' p-4 bg-white border-t flex items-center gape-2 w-full'>
      <label htmlFor='file-input' className='file-label'>
        <HiPhoto size={30} className=' text-sky-500 mr-4' />
      </label>
      <input
        id='file-input'
        type='file'
        onChange={handleFileChange}
        accept='image/*'
        className=' hidden'
      />

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
