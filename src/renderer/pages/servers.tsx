import { FiZap, FiZapOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAppState from '../hooks/use-app-state';
import EmptyState from '../components/common/empty-state';
import TopBar from '../components/common/top-bar';

export default function Servers() {
  return (
    <div className="flex flex-col items-center h-screen w-screen text-xs gap-4">
      <TopBar />
      <ServerList />
    </div>
  );
}

function ServerList() {
  const { servers } = useAppState();
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate(`/server/${server.id}`)}
              className="flex items-center gap-2 flex items-center bg-gray-200 w-full py-[12px] px-2"
              key={server.id}
            >
              <FiZap size={15} /> <b>{server.name}</b>
              <p className="text-gray-500">Port {server.port}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
