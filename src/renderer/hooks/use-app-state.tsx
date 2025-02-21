import { useContext } from 'react';
import { RootContext } from '../context/root-context';
import { IEndpoint, IServer } from '../global';

export default function useAppState() {
  const { isAppLoading, servers, setServers } = useContext(RootContext);

  function addNewServer(server: IServer) {
    window.electron.ipcRenderer.sendMessage('fs-add-server', server);
  }

  function editServer(updatedServer: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex(
      (srvr) => srvr.id === updatedServer.id,
    );

    const oldServer = copiedServers[serverIndex];
    copiedServers[serverIndex] = updatedServer;
    const newServer = copiedServers[serverIndex];

    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
  }

  function deleteServer(serverId: number) {
    const serverIdx = servers.findIndex((server) => server.id === serverId);

    window.electron.ipcRenderer.sendMessage(
      'fs-delete-server',
      servers[serverIdx],
    );
  }

  function addNewEndpoint(serverId: number, endpoint: IEndpoint) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);

    const oldServer = copiedServers[serverIndex];
    copiedServers[serverIndex].endpoints = [
      ...copiedServers[serverIndex].endpoints,
      endpoint,
    ];
    const newServer = copiedServers[serverIndex];
    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
  }

  function editEndpoint(serverId: number, updatedEndpoint: IEndpoint) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);
    const endpointIndex = copiedServers[serverIndex].endpoints.findIndex(
      (endpt) => endpt.id === updatedEndpoint.id,
    );

    const oldServer = copiedServers[serverIndex];
    copiedServers[serverIndex].endpoints[endpointIndex] = updatedEndpoint;
    const newServer = copiedServers[serverIndex];

    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
  }

  function deleteEndpoint(serverId: number, endpointId: number) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex((srvr) => srvr.id === serverId);

    const oldServer = copiedServers[serverIndex];
    copiedServers[serverIndex].endpoints = copiedServers[
      serverIndex
    ].endpoints.filter((endpt) => endpt.id !== endpointId);
    const newServer = copiedServers[serverIndex];

    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
  }

  function startServer(server: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex(
      (srvr) => srvr.id === server.id,
    );
    copiedServers[serverIndex].isLoading = true;
    setServers(copiedServers);
    window.electron.ipcRenderer.sendMessage('start-server', { ...server });
  }

  function stopServer(server: IServer) {
    const copiedServers = [...servers];
    const serverIndex = copiedServers.findIndex(
      (srvr) => srvr.id === server.id,
    );
    copiedServers[serverIndex].isLoading = true;
    setServers(copiedServers);
    window.electron.ipcRenderer.sendMessage('stop-server', { ...server });
  }

  return {
    isAppLoading,
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
