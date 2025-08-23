import { FiPlay, FiStopCircle, FiZap, FiZapOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAppState from '../hooks/use-app-state';
import EmptyState from '../components/common/empty-state';
import TopBar from '../components/common/top-bar';
import Loading from '../components/common/loading';
import Loading2 from '../components/common/loading2';
import { demoServer } from '../utils/configs';

export default function Servers() {
  const { isAppLoading } = useAppState();

  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen text-xs gap-2">
        <Loading2 />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center h-screen w-screen text-xs gap-2">
      <TopBar />
      <ServerList />
    </div>
  );
}

function ServerList() {
  const { servers, startServer, stopServer, addNewServer } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="w-full px-5 pb-5">
      {servers.length === 0 && (
        <EmptyState
          iconComponent={<FiZapOff size={20} />}
          text="No any servers yet."
          description="You can add new right now by clicking + button."
          buttonText="Add demo server"
          buttonOnClick={() => addNewServer(demoServer)}
        />
      )}

      <div className="mt-2 w-full flex flex-col gap-2">
        {servers.map((server) => {
          return (
            <button
              onClick={() => navigate(`/server/${server.id}`)}
              className="flex items-center gap-2 flex items-center bg-gray-200 w-full py-[12px] px-2 hover:bg-gray-300"
              key={server.id}
            >
              <FiZap size={15} /> <b>{server.name}</b>
              <p className="text-gray-500">Port {server.port}</p>
              <button
                title={server.isRunning ? 'Stop Server' : 'Start Server'}
                data-testid="start-stop-server-button"
                className="ml-auto flex flex-col items-center justify-center"
                disabled={server.isLoading}
                onClick={(e) => {
                  server.isRunning ? stopServer(server) : startServer(server);
                  e.stopPropagation();
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
