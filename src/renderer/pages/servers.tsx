import {
  FiPlay,
  FiSettings,
  FiStopCircle,
  FiTrash2,
  FiZap,
  FiZapOff,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAppState from '../hooks/use-app-state';
import EmptyState from '../components/common/empty-state';
import Loader from '../components/common/loading';
import TopBar from '../components/common/top-bar';
import type { IServer } from '../global';

export default function Servers() {
  return (
    <div className="flex flex-col items-center h-screen w-screen text-xs gap-4">
      <TopBar />
      <ServerList />
    </div>
  );
}

function ServerList() {
  const { servers, deleteServer, stopServer, startServer } = useAppState();
  const navigate = useNavigate();

  function handleDeleteServer(id: number, name: string) {
    const confirmed = confirm(`You sure want to delete server ${name}?`);
    if (confirmed) {
      deleteServer(id);
    }
  }

  function handleStartStopServer(server: IServer) {
    if (server.isLoading) {
      return;
    }

    if (server.isRunning) {
      stopServer(server);
    } else {
      startServer(server);
    }
  }

  return (
    <div className="w-full px-5">
      <b>Servers</b>

      {servers.length === 0 && (
        <EmptyState
          iconComponent={<FiZapOff size={20} />}
          text="No any servers yet."
          description="You can add new right now by clicking + button."
        />
      )}

      <div className="mt-2 w-full flex flex-col gap-2">
        {servers.map((server) => {
          return (
            <div
              className="flex items-center gap-2 flex items-center bg-gray-200 w-full py-[12px] px-2"
              key={server.id}
            >
              <FiZap size={15} /> <b>{server.name}</b>
              <p className="text-gray-500">Port {server.port}</p>
              <div className="ml-auto flex items-center gap-5">
                <button
                  className="flex flex-col items-center justify-center"
                  onClick={() => handleStartStopServer(server)}
                  disabled={server.isLoading}
                >
                  {server.isLoading ? (
                    <Loader />
                  ) : server.isRunning ? (
                    <FiStopCircle size={15} color="red" />
                  ) : (
                    <FiPlay size={15} />
                  )}
                </button>
                <button onClick={() => navigate(`/server/${server.id}`)}>
                  <FiSettings size={15} />
                </button>
                <button
                  disabled={server.isLoading || server.isRunning}
                  onClick={() => handleDeleteServer(server.id, server.name)}
                  className="disabled:opacity-50"
                >
                  <FiTrash2 size={15} color="red" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
