import { isMobileAppRedirect } from "./authRedirect";

export const LOGO_TAPS_TO_UNLOCK = 10;
export const TAP_SEQUENCE_TIMEOUT_MS = 2000;
export const GOOGLE_UNLOCK_STORAGE_KEY = "hemocioneGoogleAuthUnlocked";

/**
 * Google sign-in is hidden when this page is running inside a native app's
 * webview, because the OAuth flow has not been exercised there in production
 * yet. Tapping the logo LOGO_TAPS_TO_UNLOCK times in a row reveals it, so the
 * flow can be tried on a real device without shipping it to every app user.
 *
 * The web keeps it visible unconditionally — only the app is gated.
 */
export const isGoogleAuthAvailable = ({ clientId, redirect, unlocked }) => {
  if (!clientId) return false;
  if (!isMobileAppRedirect(redirect)) return true;

  return Boolean(unlocked);
};

/**
 * Advances the tap sequence. Taps more than TAP_SEQUENCE_TIMEOUT_MS apart start
 * a new sequence, so incidental taps spread over a session never add up.
 */
export const registerLogoTap = ({ count, lastTapAt, now }) => {
  const withinSequence =
    lastTapAt !== null && now - lastTapAt <= TAP_SEQUENCE_TIMEOUT_MS;
  const nextCount = withinSequence ? count + 1 : 1;

  return {
    count: nextCount,
    lastTapAt: now,
    unlocked: nextCount >= LOGO_TAPS_TO_UNLOCK,
  };
};
