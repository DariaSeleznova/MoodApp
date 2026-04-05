export function getUserName(user, fallback = 'User') {
    const displayName = user?.displayName?.trim();
    const emailName = user?.email?.split('@')[0]?.trim();
    const rawName = displayName
        ? displayName.split(/\s+/)[0]
        : emailName || fallback;

    if (!rawName) {
        return fallback;
    }

    return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}
