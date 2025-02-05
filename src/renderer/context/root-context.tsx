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
        route: '/users',
        responseCode: '200',
        response: JSON.stringify({
          data: [
            { id: 1, name: 'Tony Hanks' },
            { id: 2, name: 'Jason Bobs' },
          ],
        }),
        isActive: true,
      },
    ],
  };
  const [servers, setServers] = useState<IServer[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('fetch-app-servers');
    window.electron.ipcRenderer.on('fetch-app-servers', (args) => {
      setServers(args as IServer[]);
    });

    window.electron.ipcRenderer.on('error-happened', (args) => {
      //@ts-expect-error FIXME
      alert(args.message || 'Something went wrong');
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('start-server', (args) => {
      //@ts-expect-error FIXME
      const { server } = args;

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;

        copiedServers[serverIndex].isRunning = true;
        return copiedServers;
      });
    });

    window.electron.ipcRenderer.on('stop-server', (args) => {
      //@ts-expect-error FIXME
      const { server } = args;

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;

        copiedServers[serverIndex].isRunning = false;
        return copiedServers;
      });
    });
  }, [servers]);

  return (
    <RootContext.Provider value={{ servers, setServers }}>
      {children}
    </RootContext.Provider>
  );
}
