import { IServer } from '../global';

export const configs = {
  version: '0.0.1',
} as const;

export const demoServer: IServer = {
  id: 1.0,
  name: 'Demo Server',
  port: 3000,
  endpoints: [
    {
      id: 1.0,
      route: '/ping',
      response: 'pong',
      responseCode: '200',
      type: 'get',
      isActive: true,
      headers: [
        {
          key: 'x-header',
          value: 'x-value',
        },
      ],
    },
  ],
  headers: [
    {
      key: 'top-x-header',
      value: 'top-x-value',
    },
  ],
  isLoading: false,
  isRunning: false,
};
