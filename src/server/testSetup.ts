import firebaseAdmin from "firebase-admin";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import publicConfig from "../../firebase.public.json";

import type { Role } from "../common/userRoles";

export const setupAuthenticationService = () => {
    firebase.initializeApp(publicConfig);
    firebase.auth().useEmulator("http://127.0.0.1:9099");
};

export const getMockBearerTokenWithRole = async (role: Role) => {
    const customToken = await firebaseAdmin.auth().createCustomToken("mockUser_" + role, {
        role,
    });
    const mockUser = await firebase.auth().signInWithCustomToken(customToken);
    const mockToken = await mockUser.user?.getIdToken();
    return mockToken;
};
