import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button } from "../components/basic/inputs/Button";
import { useNavigate } from "react-router-dom";
import Loader from "../assets/images/loader.gif";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useAuth } from "@context/auth-context";

function SetAvatar() {
  const [avatar, setAvatar] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const avatarApi = "https://api.multiavatar.com/";
  const navigate = useNavigate();
  const { setAvatarApi } = useAuth();
  useEffect(() => {
    try {
      setSelected(undefined);
      (async () => {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${avatarApi}${Math.round(Math.random() * 1000)}.svg`
          );
          data.push(btoa(image.data));
        }
        console.log(isLoading);
        setAvatar(data);
      })();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("头像加载失败");
      setIsLoading(true);
    }
  }, []);

  const setProfilePicture = async () => {
    try {
      if (selected !== undefined) {
        await setAvatarApi(avatar[selected]);
        toast.success("头像设置成功");
        navigate("/chat");
      }
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 401) {
        toast.error("登录已超时，请重新登录");
        navigate("/");
      }
    }
  };

  return (
    <div className=' bg-dswall min-h-full flex justify-center items-center'>
      <div className='bg-white rounded-lg flex flex-col items-center py-8'>
        <h2 className=' text-center text-3xl m-4 text-bold'>
          📣请挑选您的头像
        </h2>
        <div className=' flex justify-center m-4'>
          {avatar.length === 0 ? (
            <img src={Loader} className=' h-40' />
          ) : (
            avatar.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  `w-20 h-20 m-4 rounded-full cursor-pointer`,
                  selected === index
                    ? " border-rose-800 border-4"
                    : "border-2 border-gray-300 "
                )}
                onClick={() => setSelected(index)}>
                <img src={`data:image/svg+xml;base64,${item}`} />
              </div>
            ))
          )}
        </div>
        <Button children='确认' onClick={setProfilePicture} />
      </div>
    </div>
  );
}

export default SetAvatar;
