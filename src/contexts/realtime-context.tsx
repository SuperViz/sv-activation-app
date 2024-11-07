"use client";

import { Channel, Realtime } from "@superviz/realtime/client";
import { createContext, useEffect, useState } from "react";

export const RealtimeContext = createContext<{
  startRealtime: (id: string, name: string) => void;
  gameChannel: Channel | null;
  defaultChannel: Channel | null;
}>({
  startRealtime: () => {},
  gameChannel: null,
  defaultChannel: null,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [gameChannel, setGameChannel] = useState<Channel | null>(null);
  const [defaultChannel, setDefaultChannel] = useState<Channel | null>(null);

  const startRealtime = async (id: string, name: string) => {
    const realtimeClient = new Realtime(
      process.env.NEXT_PUBLIC_DEVELOPER_KEY!,
      {
        participant: { id, name },
      }
    );

    const [gameChannel, defaultChannel] = await Promise.all([
      realtimeClient.connect("game"),
      realtimeClient.connect("default"),
    ]);

    setGameChannel(gameChannel);
    setDefaultChannel(defaultChannel);
  };

  return (
    <RealtimeContext.Provider
      value={{ startRealtime, gameChannel, defaultChannel }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
