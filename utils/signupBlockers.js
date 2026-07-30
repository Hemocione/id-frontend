/**
 * Fields that must be filled before the signup form can be submitted.
 *
 * Google signups replace the full form: name and email come from the Google
 * profile, and CPF, gender and address are completed later in the app. Only
 * blood type, phone and birth date are collected on top of the profile.
 */
const getSignupBlockers = ({
  signupData,
  unknownBloodType,
  googleSignup,
  acceptedTerms,
  acceptedPrivacyPolicy,
  errors,
}) => {
  const isGoogle = Boolean(googleSignup);
  const blockers = [];

  if (!signupData.givenName) blockers.push("givenName");
  if (!signupData.surName) blockers.push("surName");
  if (!unknownBloodType && !signupData.bloodType) blockers.push("bloodType");
  if (!signupData.email || errors.email) blockers.push("email");
  if (!signupData.birthDate) blockers.push("birthDate");
  if (!signupData.phone || errors.phone) blockers.push("phone");

  if (!isGoogle) {
    const passwordOk =
      signupData.password &&
      signupData.passConfirmation &&
      !errors.pass &&
      !errors.passConfirmation;

    if (!passwordOk) blockers.push("password");
    if (!signupData.gender) blockers.push("gender");
    if (!signupData.document || errors.cpf) blockers.push("document");
    if (!signupData.address?.cep || errors.cep) blockers.push("cep");
  }

  if (!acceptedTerms) blockers.push("terms");
  if (!acceptedPrivacyPolicy) blockers.push("privacyPolicy");

  return blockers;
};

export { getSignupBlockers };
