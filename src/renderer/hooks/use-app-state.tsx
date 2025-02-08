import { useContext } from 'react';
import { RootContext } from '../context/root-context';
import { IEndpoint, IServer } from '../global';

export default function useAppState() {
  const { servers, setServers } = useContext(RootContext);

  function addNewServer(server: IServer) {
    //@ts-expect-error
    setServers((prev) => [...prev, server]);
  }

  function editServer(updatedServer: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex(
      (srvr) => srvr.id === updatedServer.id,
    );
    copiedServers[serverIndex] = updatedServer;
    setServers(copiedServers);
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

    window.electron.ipcRenderer.sendMessage(
      'restart-server',
      {...copiedServers[serverIndex]},
    );
  }

  function editEndpoint(serverId: number, updatedEndpoint: IEndpoint) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);
    const endpointIndex = copiedServers[serverIndex].endpoints.findIndex(
      (endpt) => endpt.id === updatedEndpoint.id,
    );
    copiedServers[serverIndex].endpoints[endpointIndex] = updatedEndpoint;
    setServers(copiedServers);

    window.electron.ipcRenderer.sendMessage(
      'restart-server',
      {...copiedServers[serverIndex]},
    );
  }

  function deleteEndpoint(serverId: number, endpointId: number) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);
    copiedServers[serverIndex].endpoints = copiedServers[
      serverIndex
    ].endpoints.filter((endpt) => endpt.id !== endpointId);
    setServers(copiedServers);

    window.electron.ipcRenderer.sendMessage(
      'restart-server',
      {...copiedServers[serverIndex]},
    );
  }

  function startServer(server: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
    copiedServers[serverIndex].isLoading = true;
    setServers(copiedServers);

    window.electron.ipcRenderer.sendMessage('start-server', { ...server });
  }

  function stopServer(server: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((s) => s.id === server.id);
    copiedServers[serverIndex].isLoading = true;
    setServers(copiedServers);

    window.electron.ipcRenderer.sendMessage('stop-server', { ...server });
  }

  return {
    servers,
    addNewServer,
    deleteServer,
    addNewEndpoint,
    deleteEndpoint,
    startServer,
    stopServer,
    editEndpoint,
    editServer,
  };
}
