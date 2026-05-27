import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import InstituteSelectionScreen from '../screens/InstituteSelectionScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * @fileoverview Root Navigation Container for MentrixOS.
 * Manages the global stack of screens and handles transition rendering.
 * All screens are explicitly typed via RootStackParamList to guarantee type safety.
 */

/**
 * Main application navigator component.
 * 
 * @returns {React.ReactElement} The rendered navigation container.
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.LOGIN as keyof RootStackParamList} component={LoginScreen} />
        <Stack.Screen name={ROUTES.OTP as keyof RootStackParamList} component={OtpScreen} />
        <Stack.Screen name={ROUTES.INSTITUTE_SELECTION as keyof RootStackParamList} component={InstituteSelectionScreen} />
        <Stack.Screen name={ROUTES.ROLE_SELECTION as keyof RootStackParamList} component={RoleSelectionScreen} />
        <Stack.Screen name={ROUTES.DASHBOARD as keyof RootStackParamList} component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
