import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { RootContextProvider } from './context/root-context';
import Servers from './pages/servers';
import Server from './pages/server';
import AddServer from './pages/add-server';
import AddEndpoint from './pages/add-endpoint';
import EditServer from './pages/edit-server';
import EditEndpoint from './pages/edit-endpoint';
import './app.css';

export default function App() {
  return (
    <RootContextProvider>
      <Router>
        <Routes>
          <Route path="/" Component={Servers} />
          <Route path="/server/:server_id" Component={Server} />
          <Route path="/new-server" Component={AddServer} />
          <Route path="/new-endpoint/:server_id" Component={AddEndpoint} />
          <Route path="/edit-server/:server_id" Component={EditServer} />
          <Route
            path="/edit-endpoint/:server_id/:endpoint_id"
            Component={EditEndpoint}
          />
        </Routes>
      </Router>
    </RootContextProvider>
  );
}
