import dayjs from "dayjs";
import "dayjs/locale/th";

/**
 * Format date to display in Thai format
 * @param {Date} rawDate - The date to format
 * @returns {string} - Formatted date string in Thai format (e.g. "1 มกราคม 2567")
 */
export const formatDate = (rawDate) => {
  if (!rawDate) return "";
  
  let date = dayjs(rawDate);
  let thaiYear = date.year() + 543;
  return date.locale('th').format(`D MMMM ${thaiYear}`);
};

/**
 * Format time from date object
 * @param {Date} rawDate - The date to extract time from
 * @returns {string} - Formatted time string (e.g. "14:30")
 */
export const formatTime = (rawDate) => {
  if (!rawDate) return "";
  return dayjs(rawDate).format("HH:mm");
};

/**
 * Format date for MySQL database
 * @param {Date} date - The date to format for MySQL
 * @returns {string} - Date string in MySQL format (YYYY-MM-DD HH:MM:SS)
 */
export const formatDateToMySQL = (date) => {
  if (!date) return "";
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Truncate text with ellipsis if too long
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

/**
 * Format currency in Thai Baht format
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string (e.g. "฿1,234.50")
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "฿0.00";
  
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Get device's current locale
 * @returns {string} - Device locale string
 */
export const getDeviceLocale = () => {
  return 'th-TH'; // Default to Thai locale for this app
};