import TopBar from '../components/common/top-bar';
import ServerForm from '../components/server-form';

export default function AddServer() {
  return (
    <div className="h-full bg-white text-xs flex flex-col gap-5">
      <TopBar/>
      <ServerForm />
    </div>
  );
}
