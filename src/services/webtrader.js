/**
 * Creates a Web Trader signup payload from user data
 * @param {Object} userData - User data from form and Telegram
 * @returns {Object} Formatted signup payload for Web Trader API
 */
export const createSignUpPayload = (userData) => {
  return {
    // ===== Mandatory fields =====
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    mobile: userData.country_code + userData.phone_number,
    phone: userData.country_code + userData.phone_number,
    password: userData.password || generateSecurePassword(),
    brand_id: process.env.REACT_APP_BRAND_ID || "DEFAULT_BRAND_ID",
    system_id: process.env.REACT_APP_SYSTEM_ID || "DEFAULT_SYSTEM_ID",
    login_type_id: process.env.REACT_APP_LOGIN_TYPE_ID || "DEFAULT_LOGIN_TYPE_ID",

    // ===== Optional fields =====
    affiliate_id: userData.affiliate_id,
    campaign_id: userData.campaign_id,
    country_id: userData.country || "US",
    lang_id: userData.language_code || "en",
    currency_id: userData.currency_id || "USD",
    ip: userData.ip,

    // ===== Optional marketing info =====
    marketing_info: {
      source: userData.marketing_info?.source || "telegram",
      campaign: userData.marketing_info?.campaign || userData.reward?.name || "welcome_bonus",
      url: userData.marketing_info?.url || window.location.href,
      asset: userData.marketing_info?.asset
    }
  };
};

/**
 * Generates a secure password that meets Web Trader requirements
 * @returns {string} Generated password
 */
const generateSecurePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const special = '!@#$';

  const randomChar = (str) => str[Math.floor(Math.random() * str.length)];

  // Ensure password has: lowercase, uppercase, number, special char
  return (
    randomChar(chars.toUpperCase()) +
    randomChar(chars) +
    randomChar(nums) +
    randomChar(special) +
    Math.random().toString(36).slice(-6)
  );
};


