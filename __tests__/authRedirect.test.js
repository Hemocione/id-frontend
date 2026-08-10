import { resolveAuthRedirect, isAppDestination } from "../utils/authRedirect";

const FALLBACK = "https://app.hemocione.com.br/";

const resolve = (overrides = {}) =>
  resolveAuthRedirect({
    candidate: null,
    fallback: FALLBACK,
    currentHostname: "id.hemocione.com.br",
    token: "jwt-token",
    ...overrides,
  });

describe("resolveAuthRedirect - trusted destinations", () => {
  it("keeps a hemocione.com.br destination and appends the token", () => {
    const url = resolve({
      candidate: "https://app.hemocione.com.br/donations",
    });
    expect(url).toBe("https://app.hemocione.com.br/donations?token=jwt-token");
  });

  it("keeps a subdomain of hemocione.com.br", () => {
    const url = resolve({ candidate: "https://eventos.hemocione.com.br/x" });
    expect(url).toContain("eventos.hemocione.com.br");
    expect(url).toContain("token=jwt-token");
  });

  it("keeps the iOS deep link", () => {
    const url = resolve({ candidate: "apphemocione:auth" });
    expect(url).toBe("apphemocione:auth?token=jwt-token");
  });

  it("keeps the Android deep link", () => {
    const url = resolve({
      candidate: "br.com.hemocione.app://app.hemocione.com.br",
    });
    expect(url).toContain("br.com.hemocione.app://app.hemocione.com.br");
    expect(url).toContain("token=jwt-token");
  });

  it("falls back to the default when there is no candidate", () => {
    expect(resolve()).toBe(`${FALLBACK}?token=jwt-token`);
  });
});

describe("resolveAuthRedirect - the token never leaves a safe destination", () => {
  it("refuses plain http in production, so the JWT is not sent in the clear", () => {
    const url = resolve({ candidate: "http://app.hemocione.com.br/donations" });
    expect(url).toBe(`${FALLBACK}?token=jwt-token`);
  });

  it("refuses a mobile deep link lookalike host", () => {
    const url = resolve({
      candidate: "br.com.hemocione.app://app.hemocione.com.br.evil.com",
    });
    expect(url).not.toContain("evil.com");
  });

  it("refuses a mobile deep link lookalike path", () => {
    const url = resolve({ candidate: "apphemocione:authEVIL" });
    expect(url).not.toContain("authEVIL");
  });

  it("refuses an unapproved custom protocol, even from the dev host", () => {
    const url = resolve({
      candidate: "evilapp://app.hemocione.com.br",
      currentHostname: "id.d.hemocione.com.br",
    });
    expect(url).not.toContain("evilapp");
  });

  it("keeps a query string on an approved deep link", () => {
    const url = resolve({ candidate: "apphemocione:auth?ref=campanha" });
    expect(url).toContain("ref=campanha");
    expect(url).toContain("token=jwt-token");
  });
});

describe("resolveAuthRedirect - untrusted destinations", () => {
  it("does not follow an external host", () => {
    const url = resolve({ candidate: "https://evil.com/steal" });
    expect(url).not.toContain("evil.com");
    expect(url).toBe(`${FALLBACK}?token=jwt-token`);
  });

  it("does not follow a lookalike host", () => {
    const url = resolve({ candidate: "https://hemocione.com.br.evil.com/x" });
    expect(url).not.toContain("evil.com");
  });

  it("falls back on a malformed URL instead of throwing", () => {
    expect(() => resolve({ candidate: "not a url at all" })).not.toThrow();
    expect(resolve({ candidate: "not a url at all" })).toBe(
      `${FALLBACK}?token=jwt-token`
    );
  });

  it("blocks the javascript: protocol", () => {
    const url = resolve({ candidate: "javascript:alert(1)" });
    expect(url).not.toContain("javascript:");
  });

  it("blocks the data: protocol", () => {
    const url = resolve({ candidate: "data:text/html,<script>x</script>" });
    expect(url).not.toContain("data:");
  });

  it("blocks javascript: even on the dev host, where any host is trusted", () => {
    const url = resolve({
      candidate: "javascript:alert(1)",
      currentHostname: "id.d.hemocione.com.br",
    });
    expect(url).not.toContain("javascript:");
  });
});

describe("resolveAuthRedirect - dev host behaviour", () => {
  it("still allows an arbitrary http destination from the dev host", () => {
    const url = resolveAuthRedirect({
      candidate: "http://localhost:3001/callback",
      fallback: FALLBACK,
      currentHostname: "id.d.hemocione.com.br",
      token: "jwt-token",
    });
    expect(url).toBe("http://localhost:3001/callback?token=jwt-token");
  });
});

describe("resolveAuthRedirect - edge cases", () => {
  it("uses the hardcoded default when fallback is empty too", () => {
    const url = resolveAuthRedirect({
      candidate: null,
      fallback: "",
      currentHostname: "id.hemocione.com.br",
      token: "jwt-token",
    });
    expect(url).toBe("https://app.hemocione.com.br/?token=jwt-token");
  });

  it("does not duplicate an existing token param", () => {
    const url = resolve({
      candidate: "https://app.hemocione.com.br/?token=stale",
    });
    expect(url).toBe("https://app.hemocione.com.br/?token=jwt-token");
  });

  it("omits the token param when there is no token", () => {
    const url = resolveAuthRedirect({
      candidate: "https://app.hemocione.com.br/",
      fallback: FALLBACK,
      currentHostname: "id.hemocione.com.br",
      token: undefined,
    });
    expect(url).toBe("https://app.hemocione.com.br/");
    expect(url).not.toContain("token");
  });

  it("preserves other query params on the destination", () => {
    const url = resolve({
      candidate: "https://app.hemocione.com.br/?ref=campanha",
    });
    expect(url).toContain("ref=campanha");
    expect(url).toContain("token=jwt-token");
  });
});

describe("isAppDestination", () => {
  const destination = (candidate) =>
    isAppDestination({
      candidate,
      fallback: FALLBACK,
      currentHostname: "id.hemocione.com.br",
    });

  it("is the app when there is no candidate", () => {
    expect(destination(null)).toBe(true);
  });

  it("is the app for the main frontend URL", () => {
    expect(destination("https://app.hemocione.com.br/donations")).toBe(true);
  });

  it("is the app for the iOS deep link", () => {
    expect(destination("apphemocione:auth")).toBe(true);
  });

  it("is the app for the Android deep link", () => {
    expect(destination("br.com.hemocione.app://app.hemocione.com.br")).toBe(
      true
    );
  });

  it("is the app for the Android deep link with a trailing slash (what the app actually sends)", () => {
    expect(destination("br.com.hemocione.app://app.hemocione.com.br/")).toBe(
      true
    );
  });

  it("is external for a different trusted hemocione.com.br subdomain", () => {
    expect(destination("https://eventos.hemocione.com.br/callback")).toBe(
      false
    );
  });

  it("is external for the copa subdomain", () => {
    expect(destination("https://copa.hemocione.com.br/callback")).toBe(false);
  });

  it("is the app when the candidate is untrusted (falls back to the app)", () => {
    expect(destination("https://evil.com/steal")).toBe(true);
  });

  it("is the app when the candidate is malformed", () => {
    expect(destination("not a url at all")).toBe(true);
  });

  it("is the app when the fallback is empty (uses DEFAULT_REDIRECT)", () => {
    expect(
      isAppDestination({
        candidate: null,
        fallback: "",
        currentHostname: "id.hemocione.com.br",
      })
    ).toBe(true);
  });

  it("is the app for the canonical app.hemocione.com.br host even when fallback resolves elsewhere", () => {
    expect(
      isAppDestination({
        candidate: "https://app.hemocione.com.br/",
        fallback: "https://hemocione.com.br/",
        currentHostname: "id.hemocione.com.br",
      })
    ).toBe(true);
  });
});
