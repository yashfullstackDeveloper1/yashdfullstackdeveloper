/**
 * @fileoverview Centralized Route Name Constants
 * Using constants rather than hardcoded strings prevents typos when navigating.
 */
export const ROUTES = {
  LOGIN: 'Login',
  OTP: 'Otp',
  INSTITUTE_SELECTION: 'InstituteSelection',
  ROLE_SELECTION: 'RoleSelection',
  DASHBOARD: 'Dashboard',
  ADMIN_DASHBOARD: 'AdminDashboard',
} as const;

/** Type extract for route names */
export type RouteNames = typeof ROUTES[keyof typeof ROUTES];
