import { useEffect, useState, useCallback } from 'react';
import { WebSocketManager, WebSocketEventType, getWebSocketManager } from '../lib/websocket';

export function useWebSocket(url?: string) {
  const [connected, setConnected] = useState(false);
  const [manager, setManager] = useState<WebSocketManager | null>(null);

  useEffect(() => {
    if (url) {
      const wsManager = getWebSocketManager(url);
      setManager(wsManager);

      wsManager.connect().then(() => {
        setConnected(true);
      }).catch((error) => {
        console.error('Failed to connect WebSocket:', error);
        setConnected(false);
      });

      return () => {
        wsManager.disconnect();
      };
    }
  }, [url]);

  const subscribe = useCallback((event: WebSocketEventType, callback: (data: any) => void) => {
    if (!manager) return () => {};
    return manager.on(event, callback);
  }, [manager]);

  const send = useCallback((type: WebSocketEventType, data: any) => {
    if (!manager) return;
    manager.send(type, data);
  }, [manager]);

  return { connected, subscribe, send, manager };
}
