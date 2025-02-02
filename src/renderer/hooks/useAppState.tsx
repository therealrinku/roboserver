import { useContext } from 'react';
import { RootContext } from '../context/root-context';
import { IServer } from '../global';

export default function useAppState() {
  const { servers, setServers } = useContext(RootContext);

  function addNewServer(server: IServer) {
    //@ts-expect-error //idk wtf lol
    setServers((prev) => [...prev, server]);
  }

  function deleteServer(serverId: number) {
    //@ts-expect-error //idk wtf lol
    setServers((prev) => prev.filter((server) => server.id !== serverId));
  }

  return {
    servers,
    addNewServer,
    deleteServer,
  };
}
