import { IconType } from "react-icons";
interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

export const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='border-gray-300 rounded-3xl border
    p-2 mx-2'>
      <Icon />
    </button>
  );
};
