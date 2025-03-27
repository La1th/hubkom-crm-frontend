import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ProspectList from './pages/ProspectList';
import ProspectDetail from './pages/ProspectDetail';
import ProspectForm from './pages/ProspectForm';
import KanbanBoard from './pages/KanbanBoard';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { auth0Config } from './auth/auth0-config';
import { ApiProvider } from './services/api';

function App() {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope
      }}
    >
      <ApiProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<>
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
                </>}>
                  <Route path="*" element={null} />
                </Route>
              </Route>
            </Routes>
          </div>
        </Router>
      </ApiProvider>
    </Auth0Provider>
  );
}

export default App;
