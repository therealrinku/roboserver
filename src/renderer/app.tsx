import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { RootContextProvider } from './context/root-context';
import Servers from './pages/servers';
import Server from './pages/server';
import './app.css';

export default function App() {
  return (
    <RootContextProvider>
      <Router>
        <Routes>
          <Route path="/" Component={Servers} />
          <Route path="/server/:server_id" Component={Server} />
        </Routes>
      </Router>
    </RootContextProvider>
  );
}
