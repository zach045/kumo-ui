const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[A-Za-z0-9-]{2,63})+$/;

export function isValidEmail(email) {
  return emailPattern.test(email.trim());
}
