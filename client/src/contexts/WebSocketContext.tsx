import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

export type WebSocketMessage = 
  | { type: 'online_status'; userId: number; online: boolean }
  | { type: 'typing_start'; userId: number }
  | { type: 'typing_stop'; userId: number }
  | { type: 'new_message'; message: any }
  | { type: 'message_read'; conversationId: number; readBy: number };

interface WebSocketContextType {
  isConnected: boolean;
  send: (message: any) => void;
  subscribe: (listener: (message: WebSocketMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const messageListeners = useRef<Set<(message: WebSocketMessage) => void>>(new Set());
  const userRef = useRef(user); // Track current user to prevent stale reconnects

  const connect = useCallback(() => {
    // CRITICAL: Read from ref, not closure, to prevent stale reconnects
    const currentUser = userRef.current;
    if (!currentUser) return;
    
    // Only prevent connection if socket is currently open or connecting
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('[WebSocket] Connected');
      setIsConnected(true);
      
      const authUser = userRef.current;
      if (authUser) {
        ws.current?.send(JSON.stringify({ type: 'auth', userId: authUser.id }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        messageListeners.current.forEach(listener => listener(message));
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
      ws.current = null; // Clear the reference so reconnect can create new socket
      
      reconnectTimeout.current = setTimeout(() => {
        // CRITICAL: Check current user from ref, not closure
        // This prevents reconnecting with stale auth after logout
        if (userRef.current) {
          console.log('[WebSocket] Reconnecting...');
          connect();
        }
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };
  }, []); // No user dependency - reads from ref instead

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const send = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((listener: (message: WebSocketMessage) => void) => {
    messageListeners.current.add(listener);
    
    return () => {
      messageListeners.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    userRef.current = user; // Always update userRef when user changes
  }, [user]);

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return (
    <WebSocketContext.Provider value={{ isConnected, send, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}
