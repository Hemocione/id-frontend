import {
  LOGO_TAPS_TO_UNLOCK,
  TAP_SEQUENCE_TIMEOUT_MS,
  isGoogleAuthAvailable,
  registerLogoTap,
} from "../utils/googleAuthFlag";
import { isMobileAppRedirect } from "../utils/authRedirect";

describe("isMobileAppRedirect", () => {
  it("recognises the iOS deep link", () => {
    expect(isMobileAppRedirect("apphemocione:auth")).toBe(true);
  });

  it("recognises the Android deep link", () => {
    expect(
      isMobileAppRedirect("br.com.hemocione.app://app.hemocione.com.br")
    ).toBe(true);
  });

  it("recognises a deep link carrying a query string", () => {
    expect(isMobileAppRedirect("apphemocione:auth?ref=campanha")).toBe(true);
  });

  it("does not recognise the web app", () => {
    expect(isMobileAppRedirect("https://app.hemocione.com.br/")).toBe(false);
  });

  it("does not recognise a deep link lookalike", () => {
    expect(isMobileAppRedirect("apphemocione:authEVIL")).toBe(false);
    expect(
      isMobileAppRedirect(
        "br.com.hemocione.app://app.hemocione.com.br.evil.com"
      )
    ).toBe(false);
  });

  it("handles a missing or malformed redirect", () => {
    expect(isMobileAppRedirect(undefined)).toBe(false);
    expect(isMobileAppRedirect("")).toBe(false);
    expect(isMobileAppRedirect("not a url")).toBe(false);
  });
});

describe("isGoogleAuthAvailable", () => {
  it("is available on the web without any unlocking", () => {
    expect(
      isGoogleAuthAvailable({
        clientId: "abc",
        redirect: "https://app.hemocione.com.br/",
        unlocked: false,
      })
    ).toBe(true);
  });

  it("is available when there is no redirect at all", () => {
    expect(
      isGoogleAuthAvailable({
        clientId: "abc",
        redirect: undefined,
        unlocked: false,
      })
    ).toBe(true);
  });

  it("is hidden when the login came from the native app", () => {
    expect(
      isGoogleAuthAvailable({
        clientId: "abc",
        redirect: "apphemocione:auth",
        unlocked: false,
      })
    ).toBe(false);
  });

  it("becomes available in the app once unlocked", () => {
    expect(
      isGoogleAuthAvailable({
        clientId: "abc",
        redirect: "apphemocione:auth",
        unlocked: true,
      })
    ).toBe(true);
  });

  it("stays unavailable without a client id, unlocked or not", () => {
    expect(
      isGoogleAuthAvailable({
        clientId: "",
        redirect: undefined,
        unlocked: true,
      })
    ).toBe(false);
    expect(
      isGoogleAuthAvailable({
        clientId: undefined,
        redirect: "apphemocione:auth",
        unlocked: true,
      })
    ).toBe(false);
  });
});

describe("registerLogoTap", () => {
  const now = 1_700_000_000_000;

  it("counts the first tap", () => {
    expect(registerLogoTap({ count: 0, lastTapAt: null, now })).toEqual({
      count: 1,
      lastTapAt: now,
      unlocked: false,
    });
  });

  it("unlocks on the configured number of taps", () => {
    let state = { count: 0, lastTapAt: null, unlocked: false };
    for (let i = 0; i < LOGO_TAPS_TO_UNLOCK; i += 1) {
      state = registerLogoTap({ ...state, now: now + i * 100 });
    }
    expect(state.count).toBe(LOGO_TAPS_TO_UNLOCK);
    expect(state.unlocked).toBe(true);
  });

  it("does not unlock one tap short", () => {
    let state = { count: 0, lastTapAt: null, unlocked: false };
    for (let i = 0; i < LOGO_TAPS_TO_UNLOCK - 1; i += 1) {
      state = registerLogoTap({ ...state, now: now + i * 100 });
    }
    expect(state.unlocked).toBe(false);
  });

  it("restarts the sequence when taps are too far apart", () => {
    const state = registerLogoTap({
      count: 5,
      lastTapAt: now,
      now: now + TAP_SEQUENCE_TIMEOUT_MS + 1,
    });
    expect(state.count).toBe(1);
    expect(state.unlocked).toBe(false);
  });

  it("keeps counting right at the timeout boundary", () => {
    const state = registerLogoTap({
      count: 5,
      lastTapAt: now,
      now: now + TAP_SEQUENCE_TIMEOUT_MS,
    });
    expect(state.count).toBe(6);
  });

  it("takes ten taps", () => {
    expect(LOGO_TAPS_TO_UNLOCK).toBe(10);
  });
});
