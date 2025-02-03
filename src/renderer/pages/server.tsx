import {
  FiChevronLeft,
  FiPlay,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiZap,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import useAppState from '../hooks/useAppState';

export default function Server() {
  return (
    <div className="flex flex-col items-center h-screen w-screen pt-2 text-xs">
      <TitleBar />
      <EndpointsList />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex items-center w-full justify-center">
      <div className="flex items-center gap-2 font-bold border-b w-full pb-2 pl-20">
        Initiate <FiZap size={15} />
        <button className="flex items-center gap-2 absolute right-12 top-[10px]">
          <FiPlay size={15} />
        </button>
        <button className="flex items-center gap-2 absolute right-3 top-[10px]">
          <FiPlus size={15} />
        </button>
      </div>
    </div>
  );
}

function EndpointsList() {
  const navigate = useNavigate();
  const params = useParams();

  const { servers } = useAppState();
  const server = servers.find((srvr) => srvr.id === Number(params.server_id));
  const endpoints = server ? server.endpoints : [];

  return (
    <div className="self-start mt-5 w-full px-5">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <FiChevronLeft size={15} />
        </button>
        <b>Endpoints</b>
      </div>

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
                <button>
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
