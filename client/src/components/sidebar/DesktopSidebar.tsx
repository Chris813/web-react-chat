import React from "react";
import { useChatRoutes } from "../../router/chatRouter";
import { DesktopItem } from "./DesktopItem";

interface DesktopSidebarProps {
  // Define any props you need here
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = () => {
  const routes = useChatRoutes();
  console.log(routes);
  //   const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className=' lg:fixed lg:inset-y-0 lg:left-0 lg:z-40  xl:px-6 lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:px-4 lg:flex-col justify-between'>
      <nav className=' mt-4 flex flex-col justify-between'>
        <ul role='list' className=' flex flex-col items-start space-y-1 pt-4'>
          {routes.map((route) => (
            <DesktopItem
              key={route.label}
              label={route.label}
              icon={route.icon}
              href={route.path}
              onClick={route.onClick}
              active={route.active}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
