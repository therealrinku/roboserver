import { useParams } from 'react-router-dom';
import EndpointForm from '../components/endpoint-form';
import useAppState from '../hooks/use-app-state';
import TopBar from '../components/common/top-bar';

export default function EditEndpoint() {
  const params = useParams();
  const serverId = Number(params.server_id);
  const endpointId = Number(params.endpoint_id);

  const { servers } = useAppState();
  const server = servers.find((srvr) => srvr.id === serverId);
  const endpoint = server?.endpoints.find((endpt) => endpt.id === endpointId);

  return (
    <div className="h-full bg-white text-xs flex flex-col gap-5">
      <TopBar />
      <EndpointForm
        serverId={serverId}
        isEditMode={true}
        initialState={endpoint}
      />
    </div>
  );
}
