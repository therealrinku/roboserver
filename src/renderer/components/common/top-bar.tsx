import {
  FiChevronLeft,
  FiExternalLink,
  FiGithub,
  FiPlay,
  FiPlus,
  FiStopCircle,
  FiZap,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import useAppState from '../../hooks/use-app-state';
import { useMemo } from 'react';
import Loading from './loading';

export default function TopBar() {
  const route = useLocation();
  const navigate = useNavigate();

  const { servers, startServer, stopServer } = useAppState();
  const isHomepage = route.pathname === '/';
  const isServerDetailPage = route.pathname.includes('/server/');
  const serverId = Number(route.pathname.split('/').pop());

  const server = useMemo(() => {
    if (!isServerDetailPage) {
      return null;
    }

    const srvr = servers.find((s) => s.id === serverId);
    return srvr;
  }, [servers, isServerDetailPage]);

  function renderToolbar() {
    if (isHomepage) {
      return (
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => navigate(`/new/server`)}>
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
              <FiStopCircle color="red" size={15} />
            ) : (
              <FiPlay size={15} />
            )}
          </button>
          <button onClick={() => navigate(`/new/endpoint/${serverId}`)}>
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
