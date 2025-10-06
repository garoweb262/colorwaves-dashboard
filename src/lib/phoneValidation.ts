/**
 * Phone number validation utilities
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

/**
 * Validates and formats phone numbers
 * Supports various international formats including Nigerian numbers
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: "Phone number is required"
    };
  }

  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  
  // Updated regex to support various phone number formats:
  // - International format: +2347066492821
  // - Nigerian format: 07066492821, 08012345678
  // - US format: +1234567890, 1234567890
  // - General format: 7-15 digits, optionally starting with +
  const phoneRegex = /^(\+?[1-9]\d{0,14}|0[0-9]\d{8,9})$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: "Phone number is invalid. Please enter a valid phone number (e.g., 07066492821, +2347066492821)"
    };
  }

  return {
    isValid: true,
    formatted: cleanPhone
  };
}

/**
 * Formats phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return "";
  
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  
  // If it's a Nigerian number starting with 0
  if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }
  
  // If it's an international number
  if (cleanPhone.startsWith("+")) {
    const countryCode = cleanPhone.substring(0, 4); // +234
    const number = cleanPhone.substring(4);
    return `${countryCode} ${number}`;
  }
  
  return cleanPhone;
}

/**
 * Formats phone number input as user types
 */
export function formatPhoneInput(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");
  
  // If it starts with +, keep it as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  
  // If it starts with 0, keep it as is (Nigerian format)
  if (cleaned.startsWith("0")) {
    return cleaned;
  }
  
  // For other numbers, return as is
  return cleaned;
}

/**
 * Common phone number patterns for different countries
 */
export const PHONE_PATTERNS = {
  NIGERIA: /^(\+234|0)[789][01]\d{8}$/,
  US: /^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
  UK: /^(\+44|0)[1-9]\d{8,9}$/,
  GENERAL: /^(\+?[1-9]\d{0,14}|0[0-9]\d{8,9})$/
};

/**
 * Validates phone number against specific country pattern
 */
export function validatePhoneByCountry(phone: string, country: keyof typeof PHONE_PATTERNS): PhoneValidationResult {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  const pattern = PHONE_PATTERNS[country];
  
  if (!pattern.test(cleanPhone)) {
    return {
      isValid: false,
      error: `Invalid ${country.toLowerCase()} phone number format`
    };
  }
  
  return {
    isValid: true,
    formatted: cleanPhone
  };
}
