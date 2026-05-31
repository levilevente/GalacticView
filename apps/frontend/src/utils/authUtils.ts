import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { deleteCookie, sendLoginRequest, sendRegisterRequest } from '../api/auth.api';
import { auth } from '../config/firebase';

const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof AxiosError) {
        return (error.response?.data as { detail?: string } | undefined)?.detail ?? error.message ?? fallback;
    }

    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please log in or use a different email.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please check your email or register for a new account.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            default:
                return error.message ?? fallback;
        }
    }

    return fallback;
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return sendLoginRequest(userCredential);
};

export const registerUser = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendRegisterRequest(userCredential, username, firstName, lastName);
    } catch (error) {
        console.error('Error during registration:', error);
        if (auth.currentUser) {
            await auth.currentUser.delete();
        }
        throw new Error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    }
};

export const logoutUser = async () => {
    try {
        await deleteCookie();
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
