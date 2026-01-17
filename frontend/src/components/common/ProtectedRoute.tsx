import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { keycloak } = useKeycloak();

    if (!keycloak.authenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
