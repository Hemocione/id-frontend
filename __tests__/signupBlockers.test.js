import { getSignupBlockers } from "../utils/signupBlockers";

const noErrors = {
  email: false,
  pass: false,
  passConfirmation: false,
  phone: false,
  cpf: false,
  cep: false,
};

const filledForm = {
  givenName: "Ana",
  surName: "Silva",
  bloodType: "O+",
  gender: "O",
  phone: "21999999999",
  birthDate: "1990-05-02",
  email: "ana@example.com",
  password: "senha123",
  passConfirmation: "senha123",
  document: "11144477735",
  address: { cep: "22222-000" },
};

const base = {
  signupData: filledForm,
  unknownBloodType: false,
  googleSignup: null,
  requireFullProfile: true,
  acceptedTerms: true,
  acceptedPrivacyPolicy: true,
  errors: noErrors,
};

describe("getSignupBlockers - email/password signup", () => {
  it("has no blockers when the form is complete", () => {
    expect(getSignupBlockers(base)).toEqual([]);
  });

  it("blocks on missing CPF", () => {
    const signupData = { ...filledForm, document: "" };
    expect(getSignupBlockers({ ...base, signupData })).toContain("document");
  });

  it("blocks on an invalid CPF", () => {
    const errors = { ...noErrors, cpf: true };
    expect(getSignupBlockers({ ...base, errors })).toContain("document");
  });

  it("blocks on missing CEP", () => {
    const signupData = { ...filledForm, address: { cep: "" } };
    expect(getSignupBlockers({ ...base, signupData })).toContain("cep");
  });

  it("blocks on missing password", () => {
    const signupData = { ...filledForm, password: "", passConfirmation: "" };
    expect(getSignupBlockers({ ...base, signupData })).toContain("password");
  });

  it("blocks when the password confirmation does not match", () => {
    const errors = { ...noErrors, passConfirmation: true };
    expect(getSignupBlockers({ ...base, errors })).toContain("password");
  });

  it("blocks on missing gender", () => {
    const signupData = { ...filledForm, gender: "" };
    expect(getSignupBlockers({ ...base, signupData })).toContain("gender");
  });

  it("blocks on unaccepted terms", () => {
    expect(getSignupBlockers({ ...base, acceptedTerms: false })).toContain(
      "terms"
    );
  });

  it("blocks on unaccepted privacy policy", () => {
    expect(
      getSignupBlockers({ ...base, acceptedPrivacyPolicy: false })
    ).toContain("privacyPolicy");
  });

  it("accepts unknown blood type as a valid selection", () => {
    const signupData = { ...filledForm, bloodType: "" };
    expect(
      getSignupBlockers({ ...base, signupData, unknownBloodType: true })
    ).toEqual([]);
  });
});

describe("getSignupBlockers - Google signup", () => {
  const googleSignup = {
    credential: "token",
    profile: { email: "ana@example.com" },
  };

  const googleForm = {
    ...filledForm,
    password: "",
    passConfirmation: "",
    document: "",
    gender: "",
    address: { cep: "" },
  };

  const googleBase = {
    ...base,
    signupData: googleForm,
    googleSignup,
    requireFullProfile: false,
  };

  it("has no blockers without CPF, gender or address", () => {
    expect(getSignupBlockers(googleBase)).toEqual([]);
  });

  it("ignores CPF and CEP validation errors that cannot be triggered", () => {
    const errors = { ...noErrors, cpf: true, cep: true };
    expect(getSignupBlockers({ ...googleBase, errors })).toEqual([]);
  });

  it("still blocks on missing phone", () => {
    const signupData = { ...googleForm, phone: "" };
    expect(getSignupBlockers({ ...googleBase, signupData })).toContain("phone");
  });

  it("blocks on an invalid phone", () => {
    const errors = { ...noErrors, phone: true };
    expect(getSignupBlockers({ ...googleBase, errors })).toContain("phone");
  });

  it("still blocks on missing birth date", () => {
    const signupData = { ...googleForm, birthDate: "" };
    expect(getSignupBlockers({ ...googleBase, signupData })).toContain(
      "birthDate"
    );
  });

  it("still blocks on missing blood type", () => {
    const signupData = { ...googleForm, bloodType: "" };
    expect(getSignupBlockers({ ...googleBase, signupData })).toContain(
      "bloodType"
    );
  });

  it("still blocks on missing name", () => {
    const signupData = { ...googleForm, givenName: "" };
    expect(getSignupBlockers({ ...googleBase, signupData })).toContain(
      "givenName"
    );
  });

  it("still blocks on unaccepted privacy policy", () => {
    expect(
      getSignupBlockers({ ...googleBase, acceptedPrivacyPolicy: false })
    ).toContain("privacyPolicy");
  });

  it("does not ask for a password", () => {
    expect(getSignupBlockers(googleBase)).not.toContain("password");
  });
});

describe("getSignupBlockers - Google signup, app destination", () => {
  const googleSignup = {
    credential: "token",
    profile: { email: "ana@example.com" },
  };

  const googleAppBase = {
    ...base,
    signupData: filledForm,
    googleSignup,
    requireFullProfile: true,
  };

  it("has no blockers when the full form is filled in, even via Google", () => {
    expect(getSignupBlockers(googleAppBase)).toEqual([]);
  });

  it("blocks on missing CPF", () => {
    const signupData = { ...filledForm, document: "" };
    expect(getSignupBlockers({ ...googleAppBase, signupData })).toContain(
      "document"
    );
  });

  it("blocks on missing gender", () => {
    const signupData = { ...filledForm, gender: "" };
    expect(getSignupBlockers({ ...googleAppBase, signupData })).toContain(
      "gender"
    );
  });

  it("blocks on missing CEP", () => {
    const signupData = { ...filledForm, address: { cep: "" } };
    expect(getSignupBlockers({ ...googleAppBase, signupData })).toContain(
      "cep"
    );
  });

  it("still does not ask for a password", () => {
    expect(getSignupBlockers(googleAppBase)).not.toContain("password");
  });
});

describe("getSignupBlockers - email/password signup, external destination", () => {
  const externalForm = {
    ...filledForm,
    document: "",
    gender: "",
    address: { cep: "" },
  };

  const externalBase = {
    ...base,
    signupData: externalForm,
    requireFullProfile: false,
  };

  it("has no blockers without CPF, gender or address", () => {
    expect(getSignupBlockers(externalBase)).toEqual([]);
  });

  it("ignores CPF and CEP validation errors that cannot be triggered", () => {
    const errors = { ...noErrors, cpf: true, cep: true };
    expect(getSignupBlockers({ ...externalBase, errors })).toEqual([]);
  });

  it("still requires a password", () => {
    const signupData = {
      ...externalForm,
      password: "",
      passConfirmation: "",
    };
    expect(getSignupBlockers({ ...externalBase, signupData })).toContain(
      "password"
    );
  });

  it("still blocks on missing phone", () => {
    const signupData = { ...externalForm, phone: "" };
    expect(getSignupBlockers({ ...externalBase, signupData })).toContain(
      "phone"
    );
  });

  it("still blocks on missing blood type", () => {
    const signupData = { ...externalForm, bloodType: "" };
    expect(getSignupBlockers({ ...externalBase, signupData })).toContain(
      "bloodType"
    );
  });
});
