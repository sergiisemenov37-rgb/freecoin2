export type WebSocketEventType = 
  | 'balance_update'
  | 'mining_update'
  | 'guild_update'
  | 'notification'
  | 'tournament_update'
  | 'leaderboard_update';

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private listeners: Map<WebSocketEventType, Set<(data: any) => void>> = new Map();
  private connected: boolean = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('WebSocket connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          this.connected = false;
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  on(event: WebSocketEventType, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  send(type: WebSocketEventType, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }

    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now()
    };

    this.ws.send(JSON.stringify(message));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(url?: string): WebSocketManager {
  if (!wsManager && url) {
    wsManager = new WebSocketManager(url);
  }
  return wsManager!;
}

export function disconnectWebSocket(): void {
  if (wsManager) {
    wsManager.disconnect();
    wsManager = null;
  }
}

// Singleton wsClient for useWebSocket hook
class WebSocketClient {
  private manager: WebSocketManager | null = null;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  async connect(userId: string): Promise<void> {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:3001`;
    this.manager = getWebSocketManager(wsUrl);
    await this.manager.connect();
    this.notifyConnectionListeners(true);
  }

  disconnect(): void {
    if (this.manager) {
      this.manager.disconnect();
      this.notifyConnectionListeners(false);
    }
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  subscribe(type: string, handler: (data: any) => void): () => void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)!.add(handler);
    
    if (this.manager) {
      return this.manager.on(type as any, handler);
    }
    
    return () => {
      this.eventListeners.get(type)?.delete(handler);
    };
  }

  send(type: string, payload: any): void {
    if (this.manager) {
      this.manager.send(type as any, payload);
    }
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => callback(connected));
  }
}

export const wsClient = new WebSocketClient();
