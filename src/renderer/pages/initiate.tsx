import { FiPlus, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Initiate() {
  const servers = [
    {
      id: 1,
      name: 'my server',
    },
    {
      id: 2,
      name: 'random server',
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-screen w-screen pt-2 text-xs">
      <div className="flex items-center w-full justify-center">
        <b className="flex items-center gap-2">
          Initiate <FiZap size={15} />
        </b>
        <button className="flex items-center gap-2 absolute right-5">
          <FiPlus size={15} />
        </button>
      </div>

      <div className="self-start mt-5 w-full px-5">
        <b>Servers</b>
        <div className="mt-2 w-full flex flex-col gap-2">
          <button className="flex items-center gap-2 flex items-center bg-gray-100 w-full py-[12px] pl-2 border-t border-t-[3px] border-t-green-300">
            <FiZap size={15} />
            Add new server
          </button>

          {servers.map((server) => {
            return (
              <button
                onClick={() => navigate(`/server/${server.id}`)}
                className="flex items-center gap-2 flex items-center bg-gray-100 w-full py-[12px] pl-2 border-t border-t-[3px]"
                key={server.id}
              >
                <FiZap size={15} /> {server.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
