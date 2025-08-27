import {
  FiChevronLeft,
  FiLink,
  FiPlay,
  FiPlus,
  FiSettings,
  FiStopCircle,
  FiTrash2,
  FiX,
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
  const isAddNewServerPage = route.pathname === '/new-server';
  const isEditServerPage = route.pathname.includes('/edit-server');
  const isAddNewEndpointPage = route.pathname.includes('/new-endpoint');
  const isEditEndpointPage = route.pathname.includes('/edit-endpoint');

  const server = useMemo(() => {
    if (!isServerDetailPage) {
      return null;
    }

    const serverId = Number(route.pathname.split('/').pop());
    const srvr = servers.find((s) => s.id === serverId);
    return srvr;
  }, [servers, isServerDetailPage]);

  function renderToolbar() {
    if (
      isAddNewEndpointPage ||
      isAddNewServerPage ||
      isEditEndpointPage ||
      isEditServerPage
    ) {
      return (
        <div className="flex items-center ml-auto">
          <button onClick={() => navigate(-1)}>
            <FiX size={15} />
          </button>
        </div>
      );
    }

    if (isHomepage) {
      return (
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => navigate(`/new-server`)}
            title="Add new server"
          >
            <FiPlus size={15} />
          </button>
        </div>
      );
    }

    if (isServerDetailPage) {
      return (
        <div className="flex items-center gap-5 ml-auto">
          <button
            title={server?.isRunning ? 'Stop server' : 'Start server'}
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
          <button
            title="Delete server"
            disabled={server?.isLoading || server?.isRunning}
            className="disabled:opacity-50"
            onClick={() => {
              const confirmed = confirm(
                `Are you sure want to delete server ${server?.name}?`,
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
            title="Edit server"
            disabled={server?.isLoading || server?.isRunning}
            className="disabled:opacity-50"
            onClick={() => navigate(`/edit-server/${server?.id}`)}
          >
            <FiSettings size={15} />
          </button>
          <button
            title="Open server in browser"
            disabled={!server?.isRunning}
            className="disabled:opacity-50"
            onClick={() => window.open(`http://localhost:${server?.port}`)}
          >
            <FiLink size={15} />
          </button>
          <button
            onClick={() => navigate(`/new-endpoint/${server?.id}`)}
            title="Add new endpoint"
          >
            <FiPlus size={15} />
          </button>
        </div>
      );
    }
  }

  function renderLeft() {
    if (isAddNewServerPage) {
      return (
        <div className="flex items-center">
          <b>Add New Server</b>
        </div>
      );
    }

    if (isAddNewEndpointPage) {
      return (
        <div className="flex items-center">
          <b>Add New Endpoint</b>
        </div>
      );
    }

    if (isEditServerPage) {
      return (
        <div className="flex items-center">
          <b>Edit Server</b>
        </div>
      );
    }

    if (isEditEndpointPage) {
      return (
        <div className="flex items-center">
          <b>Edit Endpoint</b>
        </div>
      );
    }

    if (isHomepage) {
      return (
        <div className="flex items-center">
          <b>Servers ({servers.length})</b>
        </div>
      );
    }

    return (
      <button className="flex items-center gap-1" onClick={() => navigate(-1)}>
        <FiChevronLeft size={15} />
        <b>Endpoints ({server?.endpoints.length})</b>
      </button>
    );
  }

  return (
    <div className="flex border-b w-full py-[7px] px-5 sticky top-0 bg-white">
      {renderLeft()}
      {renderToolbar()}
    </div>
  );
}
