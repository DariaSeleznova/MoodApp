import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

function getUserDocRef(userId) {
    return doc(db, 'users', userId);
}

export async function ensureUserDocument(user) {
    if (!user) {
        return null;
    }

    const userRef = getUserDocRef(user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        const userData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            favorites: []
        };

        await setDoc(userRef, userData);
        return userData;
    }

    return userSnapshot.data();
}

export async function getUserFavorites(userId) {
    if (!userId) {
        return [];
    }

    const userSnapshot = await getDoc(getUserDocRef(userId));

    if (!userSnapshot.exists()) {
        return [];
    }

    return userSnapshot.data().favorites || [];
}

export async function addUserFavorite(userId, favorite) {
    if (!userId) {
        return;
    }

    await updateDoc(getUserDocRef(userId), {
        favorites: arrayUnion(favorite)
    });
}

export async function removeUserFavorite(userId, favorite) {
    if (!userId) {
        return;
    }

    await updateDoc(getUserDocRef(userId), {
        favorites: arrayRemove(favorite)
    });
}
