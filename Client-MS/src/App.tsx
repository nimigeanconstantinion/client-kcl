import { useEffect, useState } from "react";
import { keycloakService, type AuthState } from "./components/auth/KeycloakService";
import LoginForm from "./components/auth/LoginForm";

export default function App() {
    const [auth, setAuth] = useState<AuthState>({
        isLoading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        keycloakService.init().then(setAuth);
    }, []);


    if (auth.isLoading) return <p>Se încarcă...</p>;

    if (!auth.isAuthenticated) return <LoginForm />;

    return (
        <div>
            <h1>Bun venit, {auth.profile?.firstName}</h1>
            <button onClick={() => keycloakService.logout()}>Logout</button>
        </div>
    );
}
