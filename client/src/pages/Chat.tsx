import Layout from "@components/Layout";
import { Outlet } from "react-router-dom";
function Chat() {
  return (
    <Layout>
      {/* <div className='hidden lg:block lg:pl-80 h-full'>
        <Outlet />
      </div> */}
      <Outlet />
    </Layout>
  );
}

export default Chat;
