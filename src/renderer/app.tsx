import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { RootContextProvider } from './context/root-context';
import MyInitiateApp from './pages/initiate';
import Server from './pages/server';
import './app.css';

export default function App() {
  return (
    <Router>
      <RootContextProvider>
        <Routes>
          <Route path="/" Component={SetupApp} />
          <Route path="/server/:server_id" Component={Server} />
        </Routes>
      </RootContextProvider>
    </Router>
  );
}

function SetupApp() {
  return <MyInitiateApp />;
}
