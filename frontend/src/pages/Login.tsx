import React from 'react';
import keycloak from '../auth/keycloak';

const LoginPage: React.FC = () => {
    const handleLogin = () => {
        keycloak.login();
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Login
            </button>
        </div>
    );
};

export default LoginPage;
