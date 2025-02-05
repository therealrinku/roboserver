import { useState } from 'react';
import { IEndpoint, IServer } from '../../global';
import useAppState from '../../hooks/useAppState';

interface Props {
  type: 'server' | 'endpoint';
  callback: () => void;
  serverId?: number;
}

export default function AddNew({ type, callback, serverId }: Props) {
  return (
    <div className="fixed top-10 right-0 h-full bg-white shadow-lg w-screen">
      {type === 'server' ? (
        <AddNewServerForm onSuccess={callback} />
      ) : (
        <AddNewEndpointForm onSuccess={callback} serverId={serverId} />
      )}
    </div>
  );
}

function AddNewServerForm({ onSuccess }: { onSuccess: () => void }) {
  const { addNewServer, servers } = useAppState();

  const [name, setName] = useState('');
  const [port, setPort] = useState('');

  function handleAddNewServer() {
    if (name.trim() === '' || port.trim() === '') {
      alert('Name or port cannot be empty.');
      return;
    }

    if (isNaN(Number(port))) {
      alert('Port is not valid.');
      return;
    }

    const server: IServer = {
      id: servers.length + 1,
      name: name,
      port: Number(port),
      isRunning: false,
      isLoading: false,
      endpoints: [],
    };

    addNewServer(server);
    onSuccess();
  }

  return (
    <div className="mx-5 mt-5 flex flex-col gap-5 h-full">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="serverName">
          Server Name
        </label>
        <input
          name="serverName"
          type="text"
          className="bg-gray-200 w-full p-2 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="serverPort">
          Port
        </label>
        <input
          name="serverPort"
          type="text"
          className="bg-gray-200 w-full p-2 outline-none"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
      </div>

      <button
        className="bg-green-400 py-2 px-5 self-end font-bold hover:bg-green-500"
        onClick={handleAddNewServer}
      >
        Save
      </button>
    </div>
  );
}

function AddNewEndpointForm({
  onSuccess,
  serverId,
}: {
  onSuccess: () => void;
  serverId?: number;
}) {
  const [type, setType] = useState('get');
  const [route, setRoute] = useState('');
  const [response, setResponse] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [responseCode, setResponseCode] = useState('200');

  const { addNewEndpoint, servers } = useAppState();

  function handleAddNewEndpoint() {
    if (!serverId) {
      return;
    }

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

    addNewEndpoint(serverId, endpoint);
    onSuccess();
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
