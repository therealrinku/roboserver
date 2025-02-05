import { useEffect, useState } from 'react';
import useAppState from '../hooks/use-app-state';
import { useNavigate } from 'react-router-dom';
import type { IServer } from '../global';

export default function ServerForm({
  isEditMode = false,
  initialState,
}: {
  isEditMode?: boolean;
  initialState?: IServer;
}) {
  const { addNewServer, editServer, servers } = useAppState();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    if (isEditMode && initialState) {
      setName(initialState.name);
      setPort(initialState.port.toString());
    }
  }, [isEditMode, initialState]);

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

    if (isEditMode) {
      editServer(server);
    } else {
      addNewServer(server);
    }
    navigate(-1);
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
