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

/**
 * Whether the person will actually land on the Hemocione app itself, as
 * opposed to some other system (events, competitions, ondedoar, a partner's
 * digital stand). Asks resolveAuthRedirect where the browser is really going
 * — so an untrusted or absent candidate, which falls back to the app, counts
 * as the app too — and only then checks if that destination is the app.
 */
export const isAppDestination = ({ candidate, fallback, currentHostname }) => {
  const resolved = parseUrl(
    resolveAuthRedirect({ candidate, fallback, currentHostname })
  );
  if (isApprovedMobileTarget(resolved)) return true;

  const appUrl = parseUrl(fallback);
  return Boolean(appUrl && resolved.hostname === appUrl.hostname);
};
