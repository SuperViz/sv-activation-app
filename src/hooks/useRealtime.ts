import { RealtimeContext } from "@/contexts/realtime-context";
import { useContext } from "react";

export const useRealtime = () => useContext(RealtimeContext);
