//
// import Keycloak, {
//     type KeycloakProfile
// } from 'keycloak-js';
// import {} from "dotenv";
//
//
// export interface AuthState {
//     isLoading: boolean;
//     isAuthenticated: boolean;
//     profile?: KeycloakProfile;
//     token?: string;
//     error?: string;
// }

// const keycloak = new Keycloak({
//     url: `${import.meta.env.VITE_KEYCLOAK_URL}`,
//     realm: "rsk",
//     clientId: "react-client",
// });
//
// export const KeycloakService = {
//     keycloak,
//
//     init: async () => {
//         try {
//             const authenticated = await keycloak.init({
//                 onLoad: 'check-sso',
//                 checkLoginIframe: false,
//                 pkceMethod: 'S256',
//                 enableLogging: import.meta.env.MODE === 'development',
//                 flow: "standard"
//             });
//             console.log("Keycloak initialized. Authenticated:", authenticated);
//             alert("INITAILIZAT!!!!")
//             return authenticated;
//         } catch (err) {
//             console.error("Failed to initialize Keycloak", err);
//             return false;
//         }
//     },
//
//     loginDirect: async (username: string, password: string): Promise<string | null> => {
//         try {
//             const params = new URLSearchParams();
//             params.append("grant_type", "password");
//             params.append("client_id", "react-client");
//             params.append("username", username);
//             params.append("password", password);
//             console.log("URL din KeycloakService: "+import.meta.env.VITE_KEYCLOAK_URL);
//             const response = await fetch(`${import.meta.env.VITE_KEYCLOAK_URL}/realms/rsk/protocol/openid-connect/token`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                 body: params,
//             });
//
//             console.log("Response")
//             console.log(response);
//             if (!response.ok) {
//                 console.warn("Login failed with status", response.status);
//                 return null;
//             }
//
//             const profile = await keycloak?.loadUserInfo();
//
//
//             // const userprofile:AuthState={
//             //     isLoading: false,
//             //     isAuthenticated: true,
//             //     profile,
//             //     token: keycloak.token,
//             //     error: undefined
//             // }
//
//             const data = await response.json();
//             localStorage.setItem("kc_token", data.access_token);
//             // console.log(userprofile);
//             return data.access_token;
//         } catch (error) {
//             console.error("Login request failed:", error);
//             return null;
//         }
//     },
//
//     registerUser: async (username: string, password: string, email: string): Promise<boolean> => {
//         try {
//             // Token de admin (de obicei folosit doar în backend, dar pentru demo îl punem aici)
//             const adminParams = new URLSearchParams();
//             adminParams.append("client_id", "admin-cli");
//             adminParams.append("grant_type", "password");
//             adminParams.append("username", "admin");
//             adminParams.append("password", "admin"); // pune parola reală de admin
//
//             const adminTokenResp = await fetch("${import.meta.env.VITE_KEYCLOAK_URL}/realms/master/protocol/openid-connect/token", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                 body: adminParams,
//             });
//
//             if (!adminTokenResp.ok) {
//                 console.error("Failed to get admin token");
//                 return false;
//             }
//
//             const { access_token } = await adminTokenResp.json();
//
//             // Creare utilizator nou
//             const createResp = await fetch("${import.meta.env.VITE_KEYCLOAK_URL}/admin/realms/rsk/users", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${access_token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     username,
//                     email,
//                     enabled: true,
//                     credentials: [{ type: "password", value: password, temporary: false }],
//                 }),
//             });
//
//             if (createResp.ok) {
//                 console.log("User created successfully");
//                 return true;
//             } else {
//                 console.error("Failed to create user", await createResp.text());
//                 return false;
//             }
//         } catch (err) {
//             console.error("Error registering user", err);
//             return false;
//         }
//     },
//
//     logout: async () => {
//         localStorage.removeItem("kc_token");
//         window.location.href =
//             "${import.meta.env.VITE_KEYCLOAK_URL}/realms/rsk/protocol/openid-connect/logout?redirect_uri=http://localhost:5000/ui";
//     },
// };

// src/services/KeycloakService.ts

// const storageKey = "authState";
//
// class KeycloakService {
//     private keycloak;
//
//     constructor() {
//         this.keycloak = new Keycloak({
//             url: `${import.meta.env.VITE_KEYCLOAK_URL}`,
//             realm: "rsk",
//             clientId: "react-client",
//         });
//     }
//
//     async init(callback: (state: AuthState) => void) {
//         const stored = localStorage.getItem(storageKey);
//         const initialState = stored
//             ? JSON.parse(stored)
//             : {
//                 isLoading: true,
//                 isAuthenticated: false,
//             };
//
//         callback(initialState);
//
//         const authenticated = await this.keycloak.init({
//             onLoad: "check-sso",
//             silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
//             pkceMethod: "S256",
//         });
//
//         if (authenticated) {
//             const profile = await this.keycloak.loadUserProfile();
//
//             const newState = {
//                 isLoading: false,
//                 isAuthenticated: true,
//                 profile,
//                 token: this.keycloak.token,
//             };
//
//             localStorage.setItem(storageKey, JSON.stringify(newState));
//             callback(newState);
//         } else {
//             callback({
//                 isLoading: false,
//                 isAuthenticated: false,
//             });
//         }
//     }
//
//     login() {
//         this.keycloak.login();
//     }
//
//     register() {
//         this.keycloak.register();
//     }
//
//     logout() {
//         localStorage.removeItem(storageKey);
//         this.keycloak.logout();
//     }
//
//     getToken() {
//         return this.keycloak.token;
//     }
//
//     async refreshToken(): Promise<string | undefined> {
//         try {
//             const refreshed = await this.keycloak.updateToken(30);
//             if (refreshed) {
//                 const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
//                 stored.token = this.keycloak.token;
//                 localStorage.setItem(storageKey, JSON.stringify(stored));
//             }
//             return this.keycloak.token;
//         } catch (err) {
//             console.error("Token refresh error:", err);
//             return undefined;
//         }
//     }
//
//     getProfile(): Promise<KeycloakProfile> {
//         return this.keycloak.loadUserProfile();
//     }
// }
//
// export const keycloakService = new KeycloakService();

// src/services/KeycloakService.ts
import Keycloak, {type KeycloakProfile } from "keycloak-js";

export interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    profile?: KeycloakProfile;
    token?: string;
    roles?: string[];
    error?: string;
}

export class KeycloakService {
    keycloak = new Keycloak({
        url: "http://localhost:8081/",
        realm: "rsk",
        clientId: "react-client",
    });

    async init(): Promise<AuthState> {
        try {
            const authenticated = await this.keycloak.init({
                onLoad: "check-sso",
                pkceMethod: "S256",
            });

            if (!authenticated) {
                return {isLoading: false, isAuthenticated: false};
            }

            const profile = await this.keycloak.loadUserProfile();
            // Preluăm rolurile din tokenParsed
            const tokenParsed = this.keycloak.tokenParsed as any;
            const realmRoles: string[] = tokenParsed?.realm_access?.roles || [];
            const clientRoles: string[] = tokenParsed?.resource_access?.[this.keycloak.clientId!]?.roles || [];

            const state: AuthState = {
                isLoading: false,
                isAuthenticated: true,
                profile,
                token: this.keycloak.token,
                roles: [...realmRoles, ...clientRoles],
            };

            localStorage.setItem("authState", JSON.stringify(state));
            return state;
        } catch (err) {
            return {isLoading: false, isAuthenticated: false, error: "Init error"};
        }
    }

    login(username?: string) {
        this.keycloak.login({loginHint: username});
    }

    /** 🟢 REGISTER cu username precompletat */
    register(loginHint?: string) {
        this.keycloak.register({loginHint});
    }

    logout() {
        localStorage.removeItem("authState");
        this.keycloak.logout();
    }


    async loginDirect(username: string, password: string): Promise<AuthState> {
        try {
            const params = new URLSearchParams();
            params.append("grant_type", "password");
            params.append("client_id", this.keycloak.clientId!);
            params.append("client_secret", import.meta.env.VITE_KEYCLOAK_SECRET);

            params.append("scope", "openid email profile");
            params.append("username", username);
            params.append("password", password);

            const response = await fetch(
                `${import.meta.env.VITE_KEYCLOAK_URL}/realms/rsk/protocol/openid-connect/token`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: params,
                }
            );

            if (!response.ok) {
                return { isLoading: false, isAuthenticated: false, error: "Login failed" };
            }

            const data = await response.json();

            // 🟢 Decodăm manual JWT-ul
            const decode = (token: string) =>
                JSON.parse(atob(token.split(".")[1]));

            const tokenParsed = decode(data.access_token);
            const refreshParsed = data.refresh_token ? decode(data.refresh_token) : undefined;

            // 🟢 Setăm în keycloak-js toate valorile necesare
            this.keycloak.token = data.access_token;
            this.keycloak.tokenParsed = tokenParsed;
            this.keycloak.refreshToken = data.refresh_token;
            this.keycloak.refreshTokenParsed = refreshParsed;

            // 🟢 Preluăm profilul
            const profile = await this.keycloak.loadUserProfile();

            // 🟢 Extragem rolurile
            const realmRoles = tokenParsed?.realm_access?.roles || [];
            const clientRoles = tokenParsed?.resource_access?.[this.keycloak.clientId!]?.roles || [];

            const state: AuthState = {
                isLoading: false,
                isAuthenticated: true,
                profile,
                token: data.access_token,
                roles: [...realmRoles, ...clientRoles],
            };

            localStorage.setItem("authState", JSON.stringify(state));

            return state;

        } catch (err) {
            return { isLoading: false, isAuthenticated: false, error: "Login error" };
        }
    }

    // getRoles(): string[] {
    //     const parsed = this.keycloak.tokenParsed;
    //     if (!parsed) return [];
    //
    //     const realm = parsed.realm_access?.roles || [];
    //     const client = parsed.resource_access?.[this.keycloak.clientId]?.roles || [];
    //
    //     return [...realm, ...client];
    // }
}

export const keycloakService = new KeycloakService();
