import { ElementRef, useCallback, useEffect, useRef, useState } from "react";

import type firebase from "firebase/compat/app";
import type { FirebaseOptions } from "firebase/app";
import type firebaseui from "firebaseui";

import publicConfig from "../../firebase.public.json";

import { Paper, Stack } from "@mui/material";
import { Role } from "../common/userRoles";

declare global {
    interface Window {
        firebaseui: typeof firebaseui;
        firebase: typeof firebase;
    }
}

const firebaseConfig: FirebaseOptions = publicConfig;

// Initialize Firebase
window.firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = window.firebase.auth();
const authUI = new window.firebaseui.auth.AuthUI(auth);

export const useUser = () => {
    const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
    const [loading, setLoading] = useState<boolean>(true);
    const setUserAndLoading = useCallback((user: firebase.User | null) => {
        setUser(user);
        setLoading(false);
    }, []);
    useEffect(() => {
        auth.onAuthStateChanged(setUserAndLoading);
    }, [setUserAndLoading]);
    return [user, loading] as const;
};

export const useRole = () => {
    const [user] = useUser();
    const [role, setRole] = useState<Role | null>(null);
    useEffect(() => {
        user?.getIdTokenResult()
            .then((token) => token.claims["role"])
            .then(setRole)
            .catch(() => setRole(null));
        if (!user) {
            setRole(null);
        }
    }, [user]);

    return [role, user] as const;
};

export const Login: React.FC = () => {
    const container = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        authUI.start(container.current!, {
            signInOptions: [
                window.firebase.auth.EmailAuthProvider.PROVIDER_ID,
                window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            signInSuccessUrl: window.location.origin,
            signInFlow: "popup",
        });
    });

    return (
        <Stack alignItems="center" justifyContent="center" height="100vh">
            <Paper>
                <div ref={container} />
            </Paper>
        </Stack>
    );
};

export const signOut = () => {
    return auth.signOut();
};
