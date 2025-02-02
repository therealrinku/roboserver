import { useState } from 'react';
import { IServer } from '../../global';
import useAppState from '../../hooks/useAppState';

interface Props {
  type: 'server' | 'endpoint';
  callback: () => void;
}

export default function AddNew({ type, callback }: Props) {
  return (
    <div className="fixed top-10 right-0 h-full bg-white shadow-lg w-screen">
      {type === 'server' ? (
        <AddNewServerForm onSuccess={callback} />
      ) : (
        <AddEndpointForm />
      )}
    </div>
  );
}

function AddNewServerForm({ onSuccess }: { onSuccess: () => void }) {
  const { addNewServer } = useAppState();

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
      id: new Date().getTime() * Math.random(),
      name: name,
      port: Number(port),
      isRunning: false,
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

function AddEndpointForm() {
  return (
    <div>
      <input type="text" className="bg-gray-200 w-full p-2" />
    </div>
  );
}
