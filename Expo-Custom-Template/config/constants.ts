export const API_CONFIG = {
  BASE_URL: 'http://10.150.37.101:8000/api/v1', // Use http://10.0.2.2:3000/api/v1 for Android Emulator
  TIMEOUT: 10000,
  RETRY_DELAY: 1000,
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

export const APP_CONFIG = {
  NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Production App',
  VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
} as const;

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
} as const;