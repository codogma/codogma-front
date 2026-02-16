'use client';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';

import { devConsoleInfo, devConsoleWarn } from '@/helpers/devConsoleLogs';
import {
  connectPrivateWebSocket,
  connectPublicWebSocket,
  disconnectPrivateWebSocket,
} from '@/helpers/notificationAPI';
import { useEventListener } from '@/helpers/useEventListener';

type WebSocketProviderProps = {
  readonly children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { status } = useSession();
  const publicClientRef = useRef<Client | undefined>(undefined);

  useEffect(() => {
    publicClientRef.current = connectPublicWebSocket();
    return () => {
      if (publicClientRef?.current?.active) {
        publicClientRef.current?.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        if (status === 'authenticated') {
          await connectPrivateWebSocket();
          devConsoleInfo('Private connection established');
        } else {
          await disconnectPrivateWebSocket();
          devConsoleInfo('Private connection closed');
        }
      } catch (error) {
        devConsoleWarn('Connection error:', error);
      }
    };

    const timeoutId = setTimeout(handleAuthChange, 500);
    return () => clearTimeout(timeoutId);
  }, [status]);

  // Handle storage events for WebSocket management
  useEventListener('storage', async (_event) => {
    const savedUser = Cookies.get('user');
    if (!savedUser && publicClientRef?.current?.active) {
      await disconnectPrivateWebSocket();
    }
  });

  return <>{children}</>;
};
