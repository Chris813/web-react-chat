import clsx from "clsx";
import { Link } from "react-router-dom";

interface DesktopItemProps {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  href: string;
  active?: boolean;
}

export const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  onClick,
  href,
  active,
}) => {
  const handelClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <li onClick={handelClick}>
      <Link
        to={href}
        className={clsx(
          `
         group flex text-sm justify-start rounded-md p-1 gap-x-3 hover:bg-gray-100 hover:text-black my-4
      `,
          !active && "text-gray-500",
          active && " bg-gray-100 text-black"
        )}>
        <Icon className=' h-6 w-6 shrink-0'></Icon>
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  );
};
