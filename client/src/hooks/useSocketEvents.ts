import { useSocket } from "@context/socket-context";
import { useEffect } from "react";

export interface Event {
  name: string;
  handler(...args: any[]): any;
}
export function useSocketEvents(events: Event[]) {
  const { socket } = useSocket();
  useEffect(() => {
    for (const event of events) {
      socket.on(event.name, event.handler);
    }

    return function () {
      for (const event of events) {
        socket.off(event.name);
      }
    };
  }, [socket, events]);
}
