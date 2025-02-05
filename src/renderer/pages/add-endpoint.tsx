import { useParams } from 'react-router-dom';
import EndpointForm from '../components/endpoint-form';
import TopBar from '../components/common/top-bar';

export default function AddEndpoint() {
  const params = useParams();
  const serverId = Number(params.server_id);

  return (
    <div className="h-full bg-white text-xs flex flex-col gap-5">
      <TopBar/>
      <EndpointForm serverId={serverId} />
    </div>
  );
}
