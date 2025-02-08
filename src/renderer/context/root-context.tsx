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
    isRunning: true,
    isLoading: false,
    endpoints: [
      {
        id: 1,
        type: 'get',
        route: '/users',
        responseCode: '200',
        response:
          '{"data":[{"id":1,"name":"Tony Hanks"},{"id":2,"name":"Jason Bobs"}]}',
        isActive: true,
      },
      {
        id: 2,
        type: 'get',
        route: '/api/v12/users',
        response: 'ferfe',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 3,
        type: 'get',
        route: '/hello',
        response: 'er',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 4,
        type: 'get',
        route: '/dickhead',
        response: 'fe',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 5,
        type: 'get',
        route: '/pussy!!',
        response: 'fer',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 6,
        type: 'get',
        route: '/fuckme',
        response: 'ferfef',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 7,
        type: 'get',
        route: '/ewfwefw',
        response: 'fwe',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 8,
        type: 'get',
        route: '/ewfwefw',
        response: 'fewf',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 9,
        type: 'get',
        route: 'ewfewf',
        response: 'ewfewf',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 10,
        type: 'get',
        route: 'wefew',
        response: 'ewffew',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 11,
        type: 'get',
        route: 'ewf',
        response: 'ewfew',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 12,
        type: 'get',
        route: '/ewfwff',
        response: 'fewf',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 13,
        type: 'get',
        route: '/hello',
        response: 'ef',
        isActive: true,
        responseCode: '200',
      },
      {
        id: 14,
        type: 'get',
        route: '/wedewfewf',
        response: 'fewfef',
        isActive: true,
        responseCode: '200',
      },
    ],
  };
  const [servers, setServers] = useState<IServer[]>([demoServer]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('fetch-app-servers');
    window.electron.ipcRenderer.on('fetch-app-servers', (args) => {
      setServers(args as IServer[]);
    });

    window.electron.ipcRenderer.on('error-happened', (args) => {
      //@ts-expect-error FIXME
      const { server, message } = args;
      alert(message || 'Something went wrong');

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;
        copiedServers[serverIndex].isRunning = false;

        return copiedServers;
      });
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
