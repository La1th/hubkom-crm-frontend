import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ProspectList from './pages/ProspectList';
import ProspectDetail from './pages/ProspectDetail';
import ProspectForm from './pages/ProspectForm';
import KanbanBoard from './pages/KanbanBoard';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<ProspectList />} />
            <Route path="/prospects/new" element={<ProspectForm />} />
            <Route path="/prospects/:id" element={<ProspectDetail />} />
            <Route path="/prospects/:id/edit" element={<ProspectForm />} />
            <Route path="/pipeline" element={<KanbanBoard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
