/**
 * Fields that must be filled before the signup form can be submitted.
 *
 * googleSignup controls only what the auth method itself replaces: name and
 * email come from the Google profile, so Google signups never ask for a
 * password. requireFullProfile controls the rest — CPF, gender and address
 * are required only when the person is headed to the Hemocione app itself;
 * when the destination is some external system, those three are completed
 * later, regardless of whether the signup used Google or a password.
 */
const getSignupBlockers = ({
  signupData,
  unknownBloodType,
  googleSignup,
  requireFullProfile,
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
  }

  if (requireFullProfile) {
    if (!signupData.gender) blockers.push("gender");
    if (!signupData.document || errors.cpf) blockers.push("document");
    if (!signupData.address?.cep || errors.cep) blockers.push("cep");
  }

  if (!acceptedTerms) blockers.push("terms");
  if (!acceptedPrivacyPolicy) blockers.push("privacyPolicy");

  return blockers;
};

export { getSignupBlockers };
