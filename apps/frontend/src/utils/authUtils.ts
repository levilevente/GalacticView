import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

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

export { getApiErrorMessage };
