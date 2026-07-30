import { resolveAuthRedirect } from "../utils/authRedirect";

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
    const url = resolve({ candidate: "https://app.hemocione.com.br/donations" });
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
