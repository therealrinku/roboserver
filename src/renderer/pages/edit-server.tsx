import { useParams } from 'react-router-dom';
import useAppState from '../hooks/use-app-state';
import ServerForm from '../components/server-form';
import TopBar from '../components/common/top-bar';

export default function EditServer() {
  const params = useParams();
  const serverId = Number(params.server_id);

  const { servers } = useAppState();
  const server = servers.find((srvr) => srvr.id === serverId);

  return (
    <div className="h-full bg-white text-xs flex flex-col gap-5">
      <TopBar />
      <ServerForm isEditMode={true} initialState={server} />
    </div>
  );
}
