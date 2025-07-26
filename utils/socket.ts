import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// ⚠️ Use your local IP and make sure it's reachable from mobile
const SOCKET_URL = 'http://192.168.1.155:5000';

export const useSensorSocket = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO:', socket.id);
    });

    socket.on('new-sensor-data', (incomingData) => {
      console.log('📡 Live data received:', incomingData);
      setData(incomingData);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from socket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return data;
};
