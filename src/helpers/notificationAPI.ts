import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo, devConsoleWarn } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetNotification, GetNotificationToUpdate, Language } from '@/types';

export type NotificationCreate = {
  title: Map<Language, string>;
  message: Map<Language, string>;
};

export type NotificationUpdate = {
  title: Map<Language, string>;
  message: Map<Language, string>;
};

export type GetNotificationsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetNotification[];
};

let publicClient: Client | null = null;
let privateClient: Client | null = null;
let privateSubscription: StompSubscription | null = null;

export const connectPublicWebSocket = (): Client => {
  if (publicClient?.active) return publicClient;

  const stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ws`),
    debug: (str) => devConsoleInfo('[PUBLIC WS]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    devConsoleInfo('Public connection established:', frame);
    stompClient.subscribe('/topic/public-notifications', (message) => {
      const notification = JSON.parse(message.body);
      devConsoleInfo('Public notification received:', notification);
      dispatchCustomEvent('notification', {
        message: 'Public notification received',
        severity: 'success',
      });
    });
  };

  stompClient.onStompError = (frame) => {
    devConsoleWarn('STOMP error:', frame);
  };

  stompClient.onWebSocketError = (event) => {
    devConsoleWarn('WebSocket error:', event);
  };

  stompClient.onDisconnect = (frame) => {
    devConsoleInfo('Disconnected:', frame);
  };

  stompClient.activate();
  publicClient = stompClient;
  return stompClient;
};

export const connectPrivateWebSocket = async (): Promise<Client> => {
  if (privateClient?.active) return privateClient;

  const stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ws`),
    debug: (str) => devConsoleInfo('[PRIVATE WS]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    devConsoleInfo('Private connection established:', frame);
    privateSubscription = stompClient.subscribe(
      '/user/queue/notifications',
      (message) => {
        const notification = JSON.parse(message.body);
        devConsoleInfo('Private notification received:', notification);
        dispatchCustomEvent('notification', {
          message: 'Private notification received',
          severity: 'success',
        });
      },
    );
  };

  stompClient.onStompError = (frame) => {
    devConsoleWarn('STOMP error:', frame);
  };

  stompClient.onWebSocketError = (event) => {
    devConsoleWarn('WebSocket error:', event);
  };

  stompClient.onDisconnect = (frame) => {
    devConsoleInfo('Disconnected:', frame);
  };

  stompClient.activate();
  privateClient = stompClient;
  return stompClient;
};

export const disconnectPrivateWebSocket = async () => {
  if (privateSubscription) {
    privateSubscription.unsubscribe();
    privateSubscription = null;
  }
  if (privateClient?.active) {
    privateClient?.deactivate();
    privateClient = null;
  }
};

export const createNotification = async (
  requestData: NotificationCreate,
): Promise<void> => {
  await axiosInstance.post('/notifications', requestData);
  dispatchCustomEvent('api', {
    message: 'Notification created successfully',
    severity: 'success',
  });
};

export const updateNotification = async (
  id: number,
  requestData: NotificationUpdate,
): Promise<GetNotification> => {
  const response = await axiosInstance.put(`/notifications/${id}`, requestData);
  dispatchCustomEvent('api', {
    message: 'Notification updated successfully',
    severity: 'success',
  });
  return response.data;
};

export const getNotifications = async (
  isRead?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt',
  order: string = 'desc',
): Promise<GetNotificationsDTO> => {
  const response = await axiosInstance.get('/notifications', {
    params: {
      isRead,
      page,
      size,
      sort,
      order,
    },
  });
  return response.data;
};

export const getNotificationByIdToUpdate = async (
  id: number,
): Promise<GetNotificationToUpdate> => {
  const response = await axiosInstance.get(`/notifications/${id}`);
  return response.data;
};

export const readNotification = async (id: number): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}/read`);
};

export const readAllNotifications = async (): Promise<void> => {
  await axiosInstance.patch(`/notifications/read-all`);
};

export const deleteNotification = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/notifications/${id}/delete`);
};

export const deleteReadNotifications = async (): Promise<void> => {
  await axiosInstance.delete(`/notifications/delete-read`);
};

export const deleteSystemNotification = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/notifications/${id}/delete-system`);
};

export const deleteAllSystemNotifications = async (): Promise<void> => {
  await axiosInstance.delete(`/notifications/delete-all-system`);
};
