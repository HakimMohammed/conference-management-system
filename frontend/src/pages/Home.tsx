import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const HomePage: React.FC = () => {
    const { keycloak } = useKeycloak();

    const handleLogout = () => {
        keycloak.logout();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to the Conference Management System</h1>
            <p>You are logged in as {keycloak.tokenParsed?.preferred_username}</p>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default HomePage;
