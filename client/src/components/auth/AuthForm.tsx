import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Input } from "../basic/inputs/Input";
import { Button } from "../basic/inputs/Button";
import { AuthSocialButton } from "./AuthSocialButton";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
// import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { Context } from "../../App";
// import { useAppDispatch, useAppSelector } from "../../use/reduxHooks";
// import { loginSuccess } from "../../store/userStore";
import { useAuth } from "@context/auth-context";
import { AxiosError } from "axios";
import { resProps } from "@api/auth/types";

type Variant = "REGISTER" | "LOGIN";
const GITHUB_ID = "409f6f18c46abe64ffee";
const githubRedirectUrl =
  process.env.REACT_APP_BACKEND_URL + "/auth/github/callback";
function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<Variant>("REGISTER");
  const navigate = useNavigate();
  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === "REGISTER" ? "LOGIN" : "REGISTER"));
  }, []);
  // const { session } = useContext(Context);
  const { loginApi, registerApi, user } = useAuth();

  //事先判断是否已经登录

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "LOGIN") {
      try {
        await loginApi(data);
        // const res = await axios.post(loginRoute, data);
        // if (res.status === 200) {
        toast.success("登录成功");
        console.log(user?.image);
        if (user?.image) {
          navigate("/chat");
        } else {
          navigate("/setAvatar");
        }
        // save(res.data.token);
        //   console.log(res.data.user);
        //   dispatch(loginSuccess(res.data.user));
      } catch (err) {
        const error = err as AxiosError;
        toast.error(
          (error.response?.data as resProps)?.msg || "第三方登录失败"
        );
      }
    }
    if (variant === "REGISTER") {
      try {
        await registerApi(data);
        // const res = await axios.post(registerRoute, data);
        // if (res.status === 201) {
        toast.success("注册成功");
        navigate("/setAvatar");
        //   save(res.data.token);
        //   dispatch(loginSuccess(res.data.user));
        // }
      } catch (err) {
        const error = err as AxiosError;
        toast.error((error.response?.data as resProps).msg || "注册失败");
      }
    }
    setIsLoading(false);
  };
  const socialAction = async (action: string) => {
    setIsLoading(true);
    console.log(action);
    try {
      if (action === "github") {
        const target = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&redirect_uri=${githubRedirectUrl}?path=/&scope=user:email`;
        window.location.href = target;
        // const res = await axios.get(githubRoute);
        // console.log(res);
      } else if (action === "google") {
        // const res = await axios.get(googleRoute);
        // console.log(res);
      }
    } catch (err) {
      const error = err as Error;
      console.log(error);
      // toast.error((error.response?.data as resProps).msg || "第三方登录失败");
    }
    setIsLoading(false);
  };

  return (
    <div className=' mt-8'>
      <div className=' bg-white py-6 rounded-lg px-8 '>
        <h2 className=' text-3xl font-bold my-3 text-center'>很高兴见到您😊</h2>
        <h3 className=' text-lg text-gray-400 my-3 text-center'>
          快来和朋友们聊天吧！
        </h3>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id='name'
              label='用户名'
              register={register}
              errors={errors}
              required
            />
          )}
          <Input
            id='email'
            label='邮箱'
            type='email'
            register={register}
            errors={errors}
            required
          />
          <Input
            id='password'
            label='密码'
            type='password'
            register={register}
            errors={errors}
            required
          />
          <div className='flex justify-center'>
            <Button
              children={variant === "LOGIN" ? "登录" : "注册"}
              disabled={isLoading}
              type='submit'
            />
          </div>
        </form>
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className=' w-full border-gray-300 border-t'></div>
            </div>
            <div className=' relative flex justify-center text-sm'>
              <span className=' bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>
          <div className='flex justify-center mt-6'>
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={FcGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
          <div className=' mt-6 flex justify-center text-gray-500'>
            <div>{variant === "LOGIN" ? "还没注册？" : "已有账号？"}</div>
            <div onClick={toggleVariant} className='underline cursor-pointer'>
              {variant === "LOGIN" ? "注册账号" : "登录账号"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
