import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * useSocket Hook
 * 
 * Manages the WebSocket connection to the backend server.
 * Allows components to register callbacks for specific events.
 */
const useSocket = (url, events = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    console.log('🔌 Connecting to WebSocket...');

    // Register event listeners
    Object.entries(events).forEach(([event, callback]) => {
      socketRef.current.on(event, callback);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting WebSocket...');
        socketRef.current.disconnect();
      }
    };
  }, [url]); // Only re-run if URL changes

  return socketRef.current;
};

export default useSocket;
