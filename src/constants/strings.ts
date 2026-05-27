/**
 * @fileoverview Centralized string constants for the application.
 * This file contains all the user-facing text, ensuring easy maintenance
 * and future potential for internationalization (i18n).
 */
export const APP_STRINGS = {
    // Common
    OR: "OR",
    CONTINUE: "Continue",
    ERROR: "Error",
    
    // Login Screen
    LOGIN: {
      ENTER_PHONE_EMAIL: "Phone or Email",
      ENTER_PHONE: "Enter phone number",
      JOIN_INSTITUTE: "Join Institute",
      SEND_CODE: "Send Code",
      USE_PASSWORD: "Use Password",
      PASSWORD_PLACEHOLDER: "Password",
      FORGOT_PASSWORD: "Forgot Password",
      TITLE_MENTRIX: "Mentrix",
      TITLE_OS: "OS",
      SUBTITLE_PART1: "MentrixOS = ",
      SUBTITLE_MENTOR: "Mentor",
      SUBTITLE_PART2: " + Matrix + ",
      SUBTITLE_METRICS: "Metrics",
      DESC_PART1: "combined into one ",
      DESC_OS: "Operating System",
      DESC_PART2: " for your institute",
      WAKING_SERVER: "Waking up server...",
      ERR_INCORRECT_CREDENTIALS: "Incorrect credentials",
      ERR_MISSING_CREDENTIALS: "Please enter both Email/Phone and Password",
      ERR_NO_ACCESS_TITLE: "No Access",
      ERR_NO_INSTITUTE: "Not associated with any institute",
      ERR_LOGIN_FAILED: "Login Failed",
      ERR_UNEXPECTED: "An unexpected error occurred.",
    },
  
    // Admin Dashboard Screen
    DASHBOARD: {
      GREETING_HEY: "Hey",
      GREETING_EMOJI: "👋",
      WELCOME_SUFFIX: "Panel!",
      ACTIVE_INSTITUTES: "Active Institutes",
      ACTIVE_INSTITUTES_DESC: "Institutes actively operating and using the platform for daily management",
      INACTIVE_INSTITUTES: "Inactive Institutes",
      INACTIVE_INSTITUTES_DESC: "Institutes currently inactive and not participating in system operations",
      TOTAL_MODULES: "Total Modules",
      TOTAL_MODULES_DESC: "Complete set of features enabling academic and administrative workflows",
      TOTAL_USERS: "Total Users",
      TOTAL_USERS_DESC: "All registered users across Institutes using the platform services",
      WELCOME_PREFIX: "Welcome to MentrixOS",
    }
  };
  
