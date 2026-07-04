import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url) {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  const connect = useCallback(() => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setConnected(true);
        setError(null);
      };

      ws.current.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = () => {
        setError("WebSocket connection failed");
        setConnected(false);
      };

      ws.current.onmessage = (e) => {
        try {
          setLastMessage(e.data);
        } catch {
          /* ignore parse errors at message level */
        }
      };
    } catch (err) {
      setError(err.message || "Failed to connect");
      setConnected(false);
      reconnectTimer.current = setTimeout(connect, 3000);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((msg) => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(msg);
        return true;
      }
    } catch {
      /* silent fail */
    }
    return false;
  }, []);

  const sendJson = useCallback(
    (obj) => {
      try {
        return sendMessage(JSON.stringify(obj));
      } catch {
        return false;
      }
    },
    [sendMessage]
  );

  return { lastMessage, sendMessage, sendJson, connected, error };
}
