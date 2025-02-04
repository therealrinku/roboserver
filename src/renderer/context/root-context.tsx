import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import { IServer } from '../global';

interface IRootContext {
  servers: IServer[];
  setServers: Dispatch<IServer[]>;
}

export const RootContext = createContext<IRootContext>({
  servers: [],
  setServers: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const demoServer: IServer = {
    id: 1,
    name: 'demo server',
    port: 3000,
    isRunning: false,
    isLoading: false,
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

    window.electron.ipcRenderer.on('start-server', (args) => {
      //@ts-expect-error FIXME
      const { server, success, message } = args;

      const copiedServers = [...servers];
      const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
      copiedServers[serverIndex].isLoading = false;

      if (!success) {
        alert(message ?? 'Something went wrong while starting the server.');
        return;
      }

      copiedServers[serverIndex].isRunning = true;
      setServers(copiedServers);
    });

    window.electron.ipcRenderer.on('stop-server', (args) => {
      //@ts-expect-error FIXME
      const { server, success, message } = args;

      const copiedServers = [...servers];
      const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
      copiedServers[serverIndex].isLoading = false;

      if (!success) {
        alert(message ?? 'Something went wrong while stopping the server.');
        return;
      }
      copiedServers[serverIndex].isRunning = false;
      setServers(copiedServers);
    });
  }, []);

  return (
    <RootContext.Provider value={{ servers, setServers }}>
      {children}
    </RootContext.Provider>
  );
}
