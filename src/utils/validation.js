export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateShortcode = (shortcode) => {
  const regex = /^[a-zA-Z0-9_-]{4,20}$/;
  return regex.test(shortcode);
};

export const validateValidityMinutes = (minutes) => {
  return Number.isInteger(minutes) && minutes > 0;
};