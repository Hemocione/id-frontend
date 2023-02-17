const environment = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  publicSiteKey: process.env.NEXT_PUBLIC_SITE_KEY,
  mainFrontendUrl: process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL,
  tokenCookieKey: process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY,
  legal: {
    privacyPolicyUrl: process.env.NEXT_PUBLIC_LEGAL_PRIVACY_POLICY_URL,
    termsOfUse: process.env.NEXT_PUBLIC_LEGAL_TERMS_OF_USE_URL,
  },
};

export default environment;
