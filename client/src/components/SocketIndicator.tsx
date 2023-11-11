import { useSocket } from "@context/socket-context";

const SocketIndicator = () => {
  const { isConnet } = useSocket();
  if (isConnet) {
    return (
      <div className=' bg-green-500 rounded-xl text-sm text-gray-600 text-center'>
        Live
      </div>
    );
  } else {
    return (
      <div className=' bg-red-500 rounded-xl text-sm text-gray-600 text-center'>
        Dead
      </div>
    );
  }
};

export default SocketIndicator;
