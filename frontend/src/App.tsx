import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './auth/keycloak';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';

const App: React.FC = () => {
    return (
        <ReactKeycloakProvider authClient={keycloak}>
            <Router>
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
                </Routes>
            </Router>
        </ReactKeycloakProvider>
    );
};

export default App;
