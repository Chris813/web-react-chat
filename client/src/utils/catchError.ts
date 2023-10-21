import { AxiosError } from "axios";
import toast from "react-hot-toast";
interface resProps {
  msg: string;
  status: string;
  token?: string;
}
export const catchError = (fn: () => void, defaultString: string) => {
  try {
    console.log("start try");
    fn();
  } catch (err) {
    const error = err as AxiosError;
    console.log(error.response?.data);
    toast.error((error.response?.data as resProps).msg || defaultString);
  }
};
