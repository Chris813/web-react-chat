import clsx from "clsx";
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        `
        flex
        justify-center
        rounded-md
        px-3
        py-2
        `,
        disabled && "opacity-50 cursor-default",
        fullWidth ? "w-full" : "px-8",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-500",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:ring-sky-500"
      )}>
      {children}
    </button>
  );
};
