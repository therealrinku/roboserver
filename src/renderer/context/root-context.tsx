import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { IServer } from '../global';

interface IRootContext {
  servers: IServer[];
}

export const RootContext = createContext<IRootContext>({ servers: [] });

export function RootContextProvider({ children }: PropsWithChildren) {
  const demoServer: IServer = {
    id: 1,
    name: 'demo server',
    isRunning: false,
    endpoints: [
      {
        id: 1,
        type: 'get',
        route: '/g/:id',
        response: {
          data: { person: { id: 1, name: 'Tony Hanks' } },
        },
        isActive: true,
      },
    ],
  };
  const [servers, setServers] = useState<IServer[]>([demoServer]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('fetch-app-servers');
    window.electron.ipcRenderer.on('fetch-app-servers', (args) => {
      setServers(args as IServer[]);
    });
  }, []);

  return (
    <RootContext.Provider value={{ servers }}>{children}</RootContext.Provider>
  );
}
