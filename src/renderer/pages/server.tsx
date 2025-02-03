import {
  FiChevronLeft,
  FiDisc,
  FiPlay,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import useAppState from '../hooks/useAppState';
import EmptyState from '../components/common/EmptyState';
import { Fragment, useState } from 'react';
import AddNew from '../components/common/AddNew';

export default function Server() {
  return (
    <div className="flex flex-col items-center h-screen w-screen pt-2 text-xs">
      <TitleBar />
      <EndpointsList />
    </div>
  );
}

function TitleBar() {
  const navigate = useNavigate();
  const params = useParams();
  const [showAddEndpointModal, setShowAddEndpointModal] = useState(false);

  return (
    <div className="flex items-center w-full justify-center">
      <div className="flex items-center gap-2 font-bold border-b w-full pb-2 pl-20">
        {showAddEndpointModal ? (
          <p>Add New Endpoint</p>
        ) : (
          <Fragment>
            <button onClick={() => navigate(-1)}>
              <FiChevronLeft size={15} />
            </button>
            Initiate <FiZap size={15} />
          </Fragment>
        )}

        {!showAddEndpointModal && (
          <button className="flex items-center gap-2 absolute right-12 top-[10px]">
            <FiPlay size={15} />
          </button>
        )}

        <button
          className="flex items-center gap-2 absolute right-3 top-[10px]"
          onClick={() => setShowAddEndpointModal((prev) => !prev)}
        >
          {showAddEndpointModal ? <FiX size={15} /> : <FiPlus size={15} />}
        </button>
      </div>

      {showAddEndpointModal && (
        <AddNew
          type="endpoint"
          serverId={Number(params.server_id)}
          callback={() => setShowAddEndpointModal(false)}
        />
      )}
    </div>
  );
}

function EndpointsList() {
  const params = useParams();

  const { servers, deleteEndpoint } = useAppState();
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
    <div className="self-start mt-5 w-full px-5">
      <b>Endpoints</b>

      {endpoints.length === 0 && (
        <EmptyState
          iconComponent={<FiDisc size={20} />}
          text="No any endpoints yet."
          description="You can add new right now by clicking + button."
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

              <div className="ml-auto flex items-center gap-5">
                <button>
                  <FiSettings size={15} />
                </button>
                <button
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
