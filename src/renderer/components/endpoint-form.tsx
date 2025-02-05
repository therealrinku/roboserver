import { useEffect, useState } from 'react';
import useAppState from '../hooks/use-app-state';
import { useNavigate } from 'react-router-dom';
import type { IEndpoint } from '../global';

export default function EndpointForm({
  serverId,
  isEditMode = false,
  initialState,
}: {
  serverId: number;
  isEditMode?: boolean;
  initialState?: IEndpoint;
}) {
  const navigate = useNavigate();

  const [type, setType] = useState('get');
  const [route, setRoute] = useState('');
  const [response, setResponse] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [responseCode, setResponseCode] = useState('200');

  useEffect(() => {
    if (initialState && isEditMode) {
      setIsActive(initialState.isActive);
      setResponse(initialState.response);
      setRoute(initialState.route);
      setResponseCode(initialState.responseCode);
      setType(initialState.type);
    }
  }, [initialState, isEditMode]);

  const { addNewEndpoint, editEndpoint, servers } = useAppState();

  function handleAddNewEndpoint() {
    if (!route.trim()) {
      alert('Route cannot be empty.');
      return;
    }

    if (Number.isNaN(responseCode)) {
      alert('Invalid response code.');
      return;
    }

    const server = servers.find((srvr) => srvr.id === serverId);
    const endpoint: IEndpoint = {
      id: server ? server.endpoints.length + 1 : 1,
      type,
      route,
      response,
      isActive,
      responseCode,
    };

    if (isEditMode) {
      editEndpoint(serverId, endpoint);
    } else {
      addNewEndpoint(serverId, endpoint);
    }

    navigate(-1);
  }

  return (
    <div className="mx-5 mt-5 flex flex-col gap-5 h-full">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="route">
          Type
        </label>
        <select
          className="bg-gray-200 w-full p-2 outline-none"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="get">get</option>
          <option value="post">post</option>
          <option value="patch">patch</option>
          <option value="put">put</option>
          <option value="delete">delete</option>
          <option value="options">options</option>
          <option value="head">head</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="route">
          Route
        </label>
        <input
          name="route"
          type="text"
          className="bg-gray-200 w-full p-2 outline-none"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="responseCode">
          Response Code
        </label>
        <input
          name="responseCode"
          type="text"
          className="bg-gray-200 w-full p-2 outline-none"
          value={responseCode}
          onChange={(e) => setResponseCode(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="response">
          Response
        </label>
        <textarea
          name="response"
          className="bg-gray-200 w-full p-2 outline-none h-[30vh]"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="isActive">
          Active
        </label>
        <input
          type="checkbox"
          name="response"
          className="bg-gray-200 self-start p-2 outline-none"
          checked={isActive}
          onChange={() => setIsActive((prev) => !prev)}
        />
      </div>

      <button
        className="bg-green-400 py-2 px-5 self-end font-bold hover:bg-green-500"
        onClick={handleAddNewEndpoint}
      >
        Save
      </button>
    </div>
  );
}
