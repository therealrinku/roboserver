import { useEffect, useState } from 'react';
import useAppState from '../hooks/use-app-state';
import { useNavigate } from 'react-router-dom';
import type { IHeader, IServer } from '../global';
import { FiTrash2 } from 'react-icons/fi';

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
  const [headers, setHeaders] = useState<IHeader[]>([{ key: '', value: '' }]);

  useEffect(() => {
    if (isEditMode && initialState) {
      setName(initialState.name);
      setPort(initialState.port.toString());
      if (initialState.headers.length > 0) {
        setHeaders(initialState.headers);
      }
    }
  }, [isEditMode, initialState]);

  function handleAddNewHeader() {
    setHeaders((prev) => [...prev, { key: '', value: '' }]);
  }

  function handleChangeHeader(
    type: 'key' | 'value',
    idx: number,
    value: string,
  ) {
    setHeaders((prev) => {
      const copiedHeaders = [...prev];
      copiedHeaders[idx] = { ...copiedHeaders[idx], [type]: value };
      return copiedHeaders;
    });
  }

  function handleDeleteHeader(idx: number) {
    setHeaders((prev) => {
      if (prev.length === 1) {
        return [{ key: '', value: '' }];
      }
      return prev.filter((_, headerIdx) => headerIdx !== idx);
    });
  }

  function handleAddNewServer() {
    if (name.trim() === '' || port.trim() === '') {
      alert('Name or port cannot be empty.');
      return;
    }

    if (isNaN(Number(port))) {
      alert('Port is not valid.');
      return;
    }

    const tooManyServers = servers.length === 100;
    if (tooManyServers) {
      alert("Please don't add more than 100 servers, it could get messy.");
      return;
    }

    const server: IServer = {
      id: isEditMode && initialState ? initialState.id : servers.length + 1,
      name: name,
      port: Number(port),
      isRunning: false,
      isLoading: false,
      headers: headers,
      endpoints: isEditMode && initialState ? initialState.endpoints : [],
    };

    if (isEditMode) {
      editServer(server);
    } else {
      addNewServer(server);
    }
    navigate(-1);
  }

  return (
    <div className="mx-5 flex flex-col gap-5 h-full">
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
          autoFocus={true}
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

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="font-bold">Headers ({headers.length})</label>
          <button className="font-normal" onClick={handleAddNewHeader}>
            Add New
          </button>
        </div>

        {headers.map((header, idx) => {
          return (
            <div className="flex items-center gap-5" key={idx}>
              <input
                name="headerKey"
                type="text"
                className="bg-gray-200 w-full p-2 outline-none"
                placeholder="Key"
                value={header.key}
                onChange={(e) => handleChangeHeader('key', idx, e.target.value)}
              />
              <input
                name="headerValue"
                type="text"
                placeholder="Value"
                className="bg-gray-200 w-full p-2 outline-none"
                value={header.value}
                onChange={(e) =>
                  handleChangeHeader('value', idx, e.target.value)
                }
              />
              <button onClick={() => handleDeleteHeader(idx)}>
                <FiTrash2 size={15} color="red" />
              </button>
            </div>
          );
        })}
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
