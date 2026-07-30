import { mobileUrls } from "./mobile";

const DEFAULT_REDIRECT = "https://app.hemocione.com.br/";
const DEV_HOST_SUFFIX = "id.d.hemocione.com.br";

const parseUrl = (value) => {
  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

// Parsed from utils/mobile so the approved deep links stay defined in one place.
const mobileTargets = mobileUrls.map(parseUrl).filter(Boolean);

// Structural match, not startsWith: "apphemocione:auth" must not also approve
// "apphemocione:authEVIL", and the Android link must not approve
// "br.com.hemocione.app://app.hemocione.com.br.evil.com". A query string is
// still allowed, since only the target is being pinned.
const isApprovedMobileTarget = (url) =>
  mobileTargets.some(
    (target) =>
      target.protocol === url.protocol &&
      target.hostname === url.hostname &&
      target.pathname === url.pathname
  );

const isHemocioneHost = (url) =>
  url.hostname === "hemocione.com.br" ||
  url.hostname.endsWith(".hemocione.com.br");

/**
 * Whether a redirect target is one of the native apps — the signal that this
 * page is being shown inside the app's webview rather than a browser.
 */
export const isMobileAppRedirect = (candidate) => {
  const url = candidate ? parseUrl(candidate) : null;

  return Boolean(url && isApprovedMobileTarget(url));
};

/**
 * Allowlist, so anything unrecognised is refused by default — `javascript:`,
 * `data:` and unapproved custom schemes never reach a match.
 */
const isTrusted = (url, currentHostname) => {
  if (isApprovedMobileTarget(url)) return true;

  const isDevHost = currentHostname.endsWith(DEV_HOST_SUFFIX);

  // Plain http would put the JWT on the wire in the clear, so it is confined to
  // the dev host, where it is what makes localhost redirects work.
  if (url.protocol === "http:") return isDevHost;
  if (url.protocol === "https:") return isHemocioneHost(url) || isDevHost;

  return false;
};

/**
 * Where to send the user after a successful login or signup.
 *
 * `candidate` is user-controlled (the `redirect` query param), so an untrusted
 * destination is replaced by the fallback instead of followed — otherwise the
 * page is an open redirect. The token only ever travels to a trusted target.
 */
export const resolveAuthRedirect = ({
  candidate,
  fallback,
  currentHostname,
  token,
}) => {
  const safeFallback =
    parseUrl(fallback || DEFAULT_REDIRECT) || parseUrl(DEFAULT_REDIRECT);

  const requested = candidate ? parseUrl(candidate) : null;
  const url =
    requested && isTrusted(requested, currentHostname)
      ? requested
      : safeFallback;

  if (token) url.searchParams.set("token", token);

  return url.toString();
};
