import { MessageProp } from "@api/conversations/types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io as ClientIo } from "socket.io-client";
type SocketContextType = {
  socket: any | null;
  isConnet: boolean;
  arrivedMsg: MessageProp | null;
};
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnet: false,
  arrivedMsg: null,
});
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<any>();
  const [isConnet, setIsConnet] = useState(false);
  const [arrivedMsg, setArrivedMsg] = useState<MessageProp | null>(null);

  const receiveMessagehandler = (data: any) => {
    const isImage = data.msg.includes("data:image");
    const newMsg = {
      body: isImage ? null : data.msg,
      senderId: data.from,
      createdAt: new Date().toISOString(),
      seenIds: [data.from],
      sender: data.from,
      conversationId: data.convId,
      image: isImage ? data.msg : null,
    };
    setArrivedMsg(newMsg);
  };

  useEffect(() => {
    const socketInstance = ClientIo("http://localhost:5000");
    socketInstance.on("connect", () => {
      setIsConnet(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnet(false);
    });

    setSocket(socketInstance as any);

    socketInstance.on("receive-message", receiveMessagehandler);

    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnet, arrivedMsg }}>
      {children}
    </SocketContext.Provider>
  );
};
