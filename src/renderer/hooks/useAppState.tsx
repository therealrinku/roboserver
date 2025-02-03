import { useContext } from 'react';
import { RootContext } from '../context/root-context';
import { IEndpoint, IServer } from '../global';

export default function useAppState() {
  const { servers, setServers } = useContext(RootContext);

  function addNewServer(server: IServer) {
    //@ts-expect-error
    setServers((prev) => [...prev, server]);
  }

  function deleteServer(serverId: number) {
    //@ts-expect-error
    setServers((prev) => prev.filter((server) => server.id !== serverId));
  }

  function addNewEndpoint(serverId: number, endpoint: IEndpoint) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);
    copiedServers[serverIndex].endpoints = [
      ...copiedServers[serverIndex].endpoints,
      endpoint,
    ];
    setServers(copiedServers);
  }

  function deleteEndpoint(serverId: number, endpointId: number) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);
    copiedServers[serverIndex].endpoints = copiedServers[
      serverIndex
    ].endpoints.filter((endpt) => endpt.id !== endpointId);
    setServers(copiedServers);
  }

  return {
    servers,
    addNewServer,
    deleteServer,
    addNewEndpoint,
    deleteEndpoint,
  };
}
