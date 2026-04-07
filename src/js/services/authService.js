import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { ensureUserDocument } from './userDataService.js';
import { syncFavoritesForUser, writeFavorites } from './favoritesService.js';

let currentUser = auth.currentUser;
let pendingAuthAction = null;
let authInitialized = false;
const authListeners = new Set();

function notifyAuthListeners(user) {
    authListeners.forEach(listener => listener(user));
}

export function getIsAuthenticated() {
    return Boolean(currentUser);
}

export function getCurrentUser() {
    return currentUser;
}

export function initAuthState() {
    if (authInitialized) {
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        notifyAuthListeners(user);
        await ensureUserDocument(user);
        await syncFavoritesForUser(user);
        await runPendingAuthAction();

    });

    authInitialized = true;
}

export function subscribeToAuthState(listener) {
    authListeners.add(listener);
    listener(currentUser);

    return () => {
        authListeners.delete(listener);
    };
}

export async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    currentUser = result.user;
    return result.user;
}

export async function signupWithEmail(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, {
        displayName: name
    });
    currentUser = result.user;
    return result.user;
}

export async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    currentUser = result.user;
    return result.user;
}

export async function requestPasswordReset(email) {
    await sendPasswordResetEmail(auth, email);
}

export async function logout() {
    await signOut(auth);
    currentUser = null;
    pendingAuthAction = null;
    writeFavorites([]);


}

export function setPendingAuthAction(action) {
    pendingAuthAction = action;
}

export async function runPendingAuthAction() {
    if (!pendingAuthAction) {
        return;
    }

    const action = pendingAuthAction;
    pendingAuthAction = null;
    await action();
}
