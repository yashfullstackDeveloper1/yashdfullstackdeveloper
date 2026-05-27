import { User, Institute, Role } from '../services/api';

/**
 * @fileoverview Type definitions for the React Navigation stack.
 * This ensures type safety across all navigation calls in the app.
 */
export type RootStackParamList = {
  /** Initial loading screen */
  Splash: undefined;
  
  /** User authentication screen */
  Login: undefined;

  /** Phone OTP verification screen */
  Otp: { phoneNumber: string };
  
  /** Step 1 after login: User selects an institute from their accessible list */
  InstituteSelection: { user: User; institutes: Institute[] };
  
  /** Step 2 after login: User selects a specific role for the chosen institute */
  RoleSelection: { user: User; institute: Institute; roles: Role[]; institutes: Institute[] };
  
  /** Main application dashboard (legacy/general) */
  Dashboard: { user: User; institute: Institute; role: Role };
  
  /** Admin specific dashboard */
  AdminDashboard: { user: User; institute: Institute; role: Role };
};
