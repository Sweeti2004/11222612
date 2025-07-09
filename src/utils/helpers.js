export const generateShortcode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

export const getLocationFromIP = async () => {
  // In a real app, you would call a geolocation API
  return 'Unknown';
};