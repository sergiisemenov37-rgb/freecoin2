import { useEffect, useCallback, useState } from 'react';
import { wsClient } from '../websocket';

export function useWebSocket(userId: string) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    wsClient.connect(userId).then(() => setConnected(true));

    const unsubscribe = wsClient.onConnectionChange(setConnected);

    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, [userId]);

  const subscribe = useCallback(
    (type: string, handler: (data: any) => void) => wsClient.subscribe(type, handler),
    []
  );

  const send = useCallback(
    (type: string, payload: any) => wsClient.send(type, payload),
    []
  );

  return { connected, subscribe, send };
}
