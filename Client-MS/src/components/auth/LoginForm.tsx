// src/components/LoginForm.tsx
import { useState } from "react";
import { keycloakService } from "./KeycloakService";
import Api from "../../Api.tsx";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [valid,setValid]=useState(false);
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // keycloakService.login(username);

        keycloakService.loginDirect(username,"test");

    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        keycloakService.register(username);
    };


    const verifyTokenOAuth2 = async (): Promise<boolean> => {
        const authState = localStorage.getItem("authState");
        const token:string = authState ? (JSON.parse(authState)?.token ?? "") : "";

      if (!token) return false;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_KEYCLOAK_URL}/realms/rsk/protocol/openid-connect/userinfo`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );


            setValid(true);
            // 200 OK → token valid
            return response.ok;

        } catch (err) {
            console.error("OAuth2 token verification failed", err);
            return false;
        }
    };


    const verifyTokenSpring = async (): Promise<boolean> => {
        const authState = localStorage.getItem("authState");
        const token: string = authState ? (JSON.parse(authState)?.token ?? "") : "";

        if (!token) return false;
        try{
            let api=new Api();
            const result=await api.testToken(token);
            console.log("Din API am primit ")
            console.log(result);
            return  true;

        }catch (e){
              console.log("Eroare la API!!!")
              return Promise.reject("Eroare de autentificare "+e)
        }
    }

        return (
        <form onSubmit={handleLogin}>
            {
                valid?(
                    <p> VALID </p>
                ):""
            }
            <h2>Autentificare</h2>

            <input
                type="text"
                placeholder="User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button type="submit">Login</button>

            {/* buton extra pentru register */}
            <button type="button" onClick={handleRegister}>
                Register
            </button>

            <button type="button" onClick={verifyTokenSpring}>
                Check TOKEN
            </button>
        </form>
    );
}
