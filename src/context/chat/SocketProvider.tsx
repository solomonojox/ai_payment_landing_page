import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../auth/useAuth';
import { ApiUrl } from '../../config/apiConfig';
import { SocketContext } from './SocketContext';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(ApiUrl || 'http://localhost:4170', {
        auth: { token: localStorage.getItem('fasma_token') },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('register', { userId: user.id });
      });

      newSocket.on('disconnect', () => setIsConnected(false));

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
