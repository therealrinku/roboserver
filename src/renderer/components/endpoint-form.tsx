import { useEffect, useState } from 'react';
import useAppState from '../hooks/use-app-state';
import { useNavigate } from 'react-router-dom';
import type { IEndpoint, IHeader } from '../global';
import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from "@codemirror/lang-javascript"
import { FiTrash2 } from 'react-icons/fi';

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
  const { addNewEndpoint, editEndpoint, servers } = useAppState();

  const [type, setType] = useState('get');
  const [route, setRoute] = useState('');
  const [response, setResponse] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [responseCode, setResponseCode] = useState('200');
  const [responseType, setResponseType] = useState<Pick<IEndpoint, 'responseType'>['responseType']>("text");
  const [headers, setHeaders] = useState<IHeader[]>([{ key: '', value: '' }]);

  useEffect(() => {
    if (initialState && isEditMode) {
      setIsActive(initialState.isActive);
      setResponse(initialState.response);
      setRoute(initialState.route);
      setResponseCode(initialState.responseCode);
      setResponseType(initialState.responseType)
      setType(initialState.type);
      if (initialState.headers.length > 0) {
        setHeaders(initialState.headers);
      }
    }
  }, [initialState, isEditMode]);

  useEffect(() => {
    if (!response && responseType === "js") {
        setResponse(`//sample javascript code
async function fetch(){
  const resp = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await resp.json();
  return data;
}

fetch();`)
    }
  }, [responseType])

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
    const tooManyEndpoints = server?.endpoints.length === 200;

    if (tooManyEndpoints) {
      alert("Please don't add more than 200 endpoints, it could get messy.");
      return;
    }

    const endpoint: IEndpoint = {
      id:
        isEditMode && initialState
          ? initialState.id
          : server
            ? server.endpoints.length + 1
            : 1,
      type,
      route,
      response,
      isActive,
      responseCode,
      headers,
      responseType
    };

    if (isEditMode) {
      editEndpoint(serverId, endpoint);
    } else {
      addNewEndpoint(serverId, endpoint);
    }

    navigate(-1);
  }

  return (
    <div className="mx-5 flex flex-col gap-5 h-full pb-5">
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
          autoFocus={true}
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
        <label className="font-bold" htmlFor="responseType">
          Response Type
        </label>
        <select
          className="bg-gray-200 w-full p-2 outline-none"
          value={responseType}
          //@ts-expect-error
          onChange={(e) => setResponseType(e.target.value)}
        >
          <option value="text">text</option>
          <option value="html">html</option>
          <option value="json">json</option>
          <option value="js">javascript code</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold flex items-center gap-2" htmlFor="response">
          Response ({responseType})
        </label>
        <ReactCodeMirror
          extensions={[json(), javascript()]}
          value={response}
          onChange={(e) => setResponse(e)}
          className="w-full mt-2 border bg-gray-200"
          height="40vh"
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

      <div className="flex items-center gap-2">
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
