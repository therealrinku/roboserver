import { useContext } from 'react';
import { RootContext } from '../context/root-context';
import { IEndpoint, IServer } from '../global';

export default function useAppState() {
  const { servers, setServers } = useContext(RootContext);

  function addNewServer(server: IServer) {
    window.electron.ipcRenderer.on('fs-add-server', () => {
      setServers((prev) => [...prev, server]);
    });

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

    window.electron.ipcRenderer.on('fs-update-server', () => {
      setServers(copiedServers);
    });

    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
  }

  function deleteServer(serverId: number) {
    //@ts-expect-error
    const serverIdx = servers.findIndex((server) => server.id === serverId);

    window.electron.ipcRenderer.on('fs-delete-server', () => {
      setServers((prev) => prev.filter((server) => server.id !== serverId));
    });

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

    window.electron.ipcRenderer.on('fs-update-server', () => {
      setServers(copiedServers);
      window.electron.ipcRenderer.sendMessage('restart-server', {
        ...copiedServers[serverIndex],
      });
    });

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

    window.electron.ipcRenderer.on('fs-update-server', () => {
      setServers(copiedServers);
      window.electron.ipcRenderer.sendMessage('restart-server', {
        ...copiedServers[serverIndex],
      });
    });

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

    window.electron.ipcRenderer.on('fs-update-server', () => {
      setServers(copiedServers);
      window.electron.ipcRenderer.sendMessage('restart-server', {
        ...copiedServers[serverIndex],
      });
    });

    window.electron.ipcRenderer.sendMessage('fs-update-server', {
      oldServer,
      newServer,
    });
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
