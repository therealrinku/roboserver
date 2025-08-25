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
  isAppLoading: boolean;
  setServers: Dispatch<IServer[]>;
}

export const RootContext = createContext<IRootContext>({
  isAppLoading: false,
  servers: [],
  setServers: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [servers, setServers] = useState<IServer[]>([]);

  //fs-events
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('fs-load-servers');

    window.electron.ipcRenderer.on('fs-load-servers', (args) => {
      setServers(args as IServer[]);
      //some delay to show that amazing loader :)
      setTimeout(() => setIsAppLoading(false), 1500);
    });

    window.electron.ipcRenderer.on('fs-add-server', (args) => {
      //@ts-expect-error
      const server = args.server as IServer;
      setServers((prev) => {
        const copiedServers = [...prev];
        return [...copiedServers, server];
      });
    });

    window.electron.ipcRenderer.on('fs-update-server', (args) => {
      //@ts-expect-error
      const updatedServer = args.server as IServer;

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex(
          (srvr) => srvr.id === updatedServer.id,
        );
        copiedServers[serverIndex] = updatedServer;

        if (copiedServers[serverIndex].isRunning) {
          copiedServers[serverIndex].isLoading = true;
        }

        window.electron.ipcRenderer.sendMessage('restart-server', {
          ...copiedServers[serverIndex],
        });

        return copiedServers;
      });
    });

    window.electron.ipcRenderer.on('fs-delete-server', (args) => {
      //@ts-expect-error
      const server = args.server as IServer;
      setServers((prev) => prev.filter((srvr) => srvr.id !== server.id));
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('error-happened', (args) => {
      //@ts-expect-error
      const server = args.server as IServer;
      //@ts-expect-error
      const message = args.message as string;

      alert(message || 'Something went wrong');

      if (!server) {
        return;
      }

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;
        copiedServers[serverIndex].isRunning = false;

        return copiedServers;
      });
    });

    window.electron.ipcRenderer.on('start-server', (args) => {
      //@ts-expect-error
      const server = args.server as IServer;

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;
        copiedServers[serverIndex].isRunning = true;

        return copiedServers;
      });
    });

    window.electron.ipcRenderer.on('stop-server', (args) => {
      //@ts-expect-error
      const server = args.server as IServer;

      setServers((prevStateOfServers) => {
        const copiedServers = [...prevStateOfServers];
        const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
        copiedServers[serverIndex].isLoading = false;
        copiedServers[serverIndex].isRunning = false;

        return copiedServers;
      });
    });
  }, []);

  return (
    <RootContext.Provider value={{ isAppLoading, servers, setServers }}>
      {children}
    </RootContext.Provider>
  );
}
