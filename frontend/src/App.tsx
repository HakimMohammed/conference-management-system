import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from './auth/keycloak';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import KeynotesPage from './pages/KeynotesPage';
import ConferencesPage from './pages/ConferencesPage';
import ConferenceDetailsPage from './pages/ConferenceDetailsPage';

const App: React.FC = () => {
    return (
        <ReactKeycloakProvider authClient={keycloak}>
            <Router>
                <Nav />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/keynotes"
                        element={
                            <ProtectedRoute>
                                <KeynotesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/conferences"
                        element={
                            <ProtectedRoute>
                                <ConferencesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/conferences/:id"
                        element={
                            <ProtectedRoute>
                                <ConferenceDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ReactKeycloakProvider>
    );
};

const Nav: React.FC = () => {
    const { keycloak } = useKeycloak();

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <ul className="flex space-x-4">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/keynotes">Keynotes</Link>
                </li>
                <li>
                    <Link to="/conferences">Conferences</Link>
                </li>
                {keycloak.authenticated && (
                    <li className="ml-auto">
                        <button onClick={() => keycloak.logout()}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default App;
