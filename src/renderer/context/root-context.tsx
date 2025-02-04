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
        responseCode: '200',
        response: JSON.stringify({
          data: { person: { id: 1, name: 'Tony Hanks' } },
        }),
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
      const { server } = args;

      const copiedServers = [...servers];
      const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
      copiedServers[serverIndex].isLoading = false;

      copiedServers[serverIndex].isRunning = true;
      setServers(copiedServers);
    });

    window.electron.ipcRenderer.on('stop-server', (args) => {
      //@ts-expect-error FIXME
      const { server } = args;

      const copiedServers = [...servers];
      const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
      copiedServers[serverIndex].isLoading = false;

      copiedServers[serverIndex].isRunning = false;
      setServers(copiedServers);
    });

    window.electron.ipcRenderer.on('error-happened', (args) => {
      //@ts-expect-error FIXME
      alert(args.message || 'Something went wrong');
    });
  }, []);

  return (
    <RootContext.Provider value={{ servers, setServers }}>
      {children}
    </RootContext.Provider>
  );
}
