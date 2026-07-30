import { mobileUrls } from "./mobile";

const DEFAULT_REDIRECT = "https://app.hemocione.com.br/";

// Blocked regardless of host, including on the dev host where any destination is
// otherwise trusted — a javascript: or data: redirect is script execution.
const DANGEROUS_PROTOCOLS = ["javascript:", "data:", "vbscript:", "blob:"];

const parseUrl = (value) => {
  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

const isTrusted = (url, currentHostname) => {
  if (DANGEROUS_PROTOCOLS.includes(url.protocol)) return false;

  return (
    url.hostname === "hemocione.com.br" ||
    url.hostname.endsWith(".hemocione.com.br") ||
    currentHostname.endsWith("id.d.hemocione.com.br") ||
    mobileUrls.some((mobileUrl) => url.toString().startsWith(mobileUrl))
  );
};

/**
 * Where to send the user after a successful login or signup.
 *
 * `candidate` is user-controlled (the `redirect` query param), so an untrusted
 * destination is replaced by the fallback instead of followed — otherwise the
 * page is an open redirect. The token only ever travels to a trusted host.
 *
 * Custom mobile schemes (`apphemocione:`, `br.com.hemocione.app://`) are valid
 * destinations, so this cannot simply require http/https.
 */
export const resolveAuthRedirect = ({
  candidate,
  fallback,
  currentHostname,
  token,
}) => {
  const safeFallback = parseUrl(fallback || DEFAULT_REDIRECT) ||
    parseUrl(DEFAULT_REDIRECT);

  const requested = candidate ? parseUrl(candidate) : null;
  const url =
    requested && isTrusted(requested, currentHostname)
      ? requested
      : safeFallback;

  if (token) url.searchParams.set("token", token);

  return url.toString();
};
