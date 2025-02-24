import { FiDisc, FiSettings, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import useAppState from '../hooks/use-app-state';
import EmptyState from '../components/common/empty-state';
import TopBar from '../components/common/top-bar';
import { demoServer } from '../utils/configs';

export default function Server() {
  return (
    <div className="flex flex-col items-center h-screen w-screen text-xs gap-2">
      <TopBar />
      <EndpointsList />
    </div>
  );
}

function EndpointsList() {
  const params = useParams();
  const navigate = useNavigate();

  const { servers, deleteEndpoint, addNewEndpoint } = useAppState();
  const server = servers.find((srvr) => srvr.id === Number(params.server_id));
  const endpoints = server ? server.endpoints : [];

  function handleDeleteEndpoint(endpointId: number, route: string) {
    const confirmed = confirm(
      `Are you sure want to delete the route ${route}?`,
    );
    if (confirmed) {
      deleteEndpoint(Number(params.server_id), endpointId);
    }
  }

  return (
    <div className="w-full px-5 pb-5">
      {endpoints.length === 0 && (
        <EmptyState
          iconComponent={<FiDisc size={20} />}
          text="No any endpoints yet."
          description="You can add new right now by clicking + button."
          buttonText="Add demo endpoint"
          buttonOnClick={() =>
            addNewEndpoint(Number(params.server_id), demoServer.endpoints[0])
          }
        />
      )}

      <div className="mt-2 w-full flex flex-col gap-2">
        {endpoints.map((endpoint) => {
          return (
            <div
              className="flex items-center gap-2 flex items-center bg-gray-200 w-full py-[12px] px-2"
              key={endpoint.id}
            >
              <p className="bg-gray-500 text-white px-2 font-bold">
                {endpoint.type}
              </p>
              <p>{endpoint.route}</p>

              {!endpoint.isActive && <p className="text-red-500">Inactive</p>}
              <div className="ml-auto flex items-center gap-5">
                <button
                  title="Edit endpoint"
                  onClick={() =>
                    navigate(`/edit-endpoint/${server?.id}/${endpoint.id}`)
                  }
                >
                  <FiSettings size={15} />
                </button>
                <button
                  title="Delete endpoint"
                  onClick={() =>
                    handleDeleteEndpoint(endpoint.id, endpoint.route)
                  }
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
