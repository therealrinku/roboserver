import {
  FiChevronLeft,
  FiPause,
  FiPlay,
  FiPlus,
  FiStopCircle,
  FiTool,
  FiTrash2,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import useAppState from '../../hooks/use-app-state';
import { useMemo } from 'react';
import Loading from './loading';

export default function TopBar() {
  const route = useLocation();
  const navigate = useNavigate();

  const { servers, startServer, stopServer, deleteServer } = useAppState();
  const isHomepage = route.pathname === '/';
  const isServerDetailPage = route.pathname.includes('/server/');

  const server = useMemo(() => {
    if (!isServerDetailPage) {
      return null;
    }

    const serverId = Number(route.pathname.split('/').pop());
    const srvr = servers.find((s) => s.id === serverId);
    return srvr;
  }, [servers, isServerDetailPage]);

  function renderToolbar() {
    if (isHomepage) {
      return (
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => navigate(`/new-server`)}>
            <FiPlus size={15} />
          </button>
        </div>
      );
    }

    if (isServerDetailPage) {
      return (
        <div className="flex items-center gap-5 ml-auto">
          <button
            className="flex flex-col items-center justify-center"
            disabled={server?.isLoading}
            onClick={() => {
              if (server?.isRunning) {
                stopServer(server);
              } else if (server) {
                startServer(server);
              }
            }}
          >
            {server?.isLoading ? (
              <Loading />
            ) : server?.isRunning ? (
              <FiPause color="red" size={15} />
            ) : (
              <FiPlay size={15} />
            )}
          </button>
          <button
            disabled={server?.isLoading || server?.isRunning}
            className="disabled:opacity-50"
            onClick={() => {
              const confirmed = confirm(
                `Are you sure want to delete ${server?.name}`,
              );
              if (confirmed && server) {
                deleteServer(server.id);
                navigate(-1);
              }
            }}
          >
            <FiTrash2 size={15} color="red" />
          </button>
          <button
            disabled={server?.isLoading || server?.isRunning}
            className="disabled:opacity-50"
            onClick={() => navigate(`/edit-server/${server?.id}`)}
          >
            <FiTool size={15} />
          </button>
          <button onClick={() => navigate(`/new-endpoint/${server?.id}`)}>
            <FiPlus size={15} />
          </button>
        </div>
      );
    }
  }

  function renderLeft() {
    if (isHomepage) {
      return (
        <div className="flex items-center gap-2">
          <a
            target="_blank"
            href="https://github.com/therealrinku/initiate"
            className="flex items-center gap-1"
          >
            <span className="font-bold">initiate v0.0.0</span>
          </a>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <button
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <FiChevronLeft size={15} />
          <span>Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex border-b w-full py-[7px] px-5">
      {renderLeft()}
      {renderToolbar()}
    </div>
  );
}
