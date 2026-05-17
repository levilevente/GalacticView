import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

import { auth } from '../config/firebase';

const processAuthTokens = async (userCredential: UserCredential) => {
    const user = userCredential.user;

    const token = await user.getIdToken();
    const tokenResult = await user.getIdTokenResult();

    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpire', tokenResult.expirationTime);
    localStorage.setItem('refreshToken', user.refreshToken);

    return user;
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return processAuthTokens(userCredential);
};

export const registerUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return processAuthTokens(userCredential);
};
