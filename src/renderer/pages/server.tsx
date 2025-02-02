import { FiChevronLeft, FiPlus, FiPower, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Server() {
  const endpoints = [
    {
      id: 1,
      type: 'get',
      route: '/get_video/{video_id}',
    },
    {
      id: 2,
      type: 'post',
      route: '/post_video',
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
          <FiPower size={15} />
        </button>
      </div>

      <div className="self-start mt-5 w-full px-5">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <FiChevronLeft size={15} />
          </button>
          <b>Endpoints</b>
        </div>
        <div className="mt-2 w-full flex flex-col gap-2">
          <button className="flex items-center gap-2 flex items-center bg-gray-100 w-full py-[12px] pl-2 border-t border-t-[3px] border-t-green-300">
            <p className="bg-gray-500 text-white px-2">new</p>
            Add new endpoint
          </button>

          {endpoints.map((endpoint) => {
            return (
              <button
                className="flex items-center gap-2 flex items-center bg-gray-100 w-full py-[12px] pl-2 border-t border-t-[3px]"
                key={endpoint.id}
              >
                <p className="bg-gray-500 text-white px-2">{endpoint.type}</p>
                {endpoint.route}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
