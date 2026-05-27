/**
 * @fileoverview Shared header component for authenticated application screens.
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../theme/useTheme';

const appLogo = require('../assets/logos/logo-black.png');
const menuIcon = require('../assets/icons/menu-icon.png');
const logoutIcon = require('../assets/icons/logout-icon.png');

/**
 * Props for the Header component.
 */
interface HeaderProps {
  /** User object containing name and profile details */
  user: any; 
  /** Whether to show the hamburger menu icon */
  showMenu?: boolean;
  /** Whether to show the logout button */
  showLogout?: boolean;
  /** Callback fired when the logout button is pressed */
  onLogout?: () => void;
  /** Callback fired when the profile avatar is pressed */
  onProfilePress?: () => void;
  /** Whether to display the app name next to the logo */
  showAppName?: boolean;
  /** Whether the header is being used in a dashboard context (alters styling) */
  isDashboard?: boolean;
  /** The name of the active institute to display */
  instituteName?: string;
}

/**
 * Renders the main application header with user context, navigation, and actions.
 * 
 * @param {HeaderProps} props - The component props
 * @returns {React.ReactElement} The Header component
 */
const Header: React.FC<HeaderProps> = ({ 
  user, 
  showMenu = false, 
  showLogout = false,
  onLogout,
  onProfilePress,
  showAppName = true,
  isDashboard = false,
  instituteName
}) => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const displayName = user?.full_name || user?.name || 'User';
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View style={[
      styles.header, 
      isDashboard && { borderBottomWidth: 1, borderBottomColor: colors.border },
      isTablet && styles.tabletHeader
    ]}>
      <View style={styles.headerLeft}>
        {showMenu && (
          <TouchableOpacity>
            <Image source={menuIcon} style={[styles.menuIconStyle, { tintColor: colors.text }]} />
          </TouchableOpacity>
        )}
        <Image
          source={appLogo}
          style={[showMenu ? styles.logoIconSmall : styles.headerLogo, isDark && { tintColor: '#FFF' }]}
          resizeMode="contain"
        />
        {showAppName && (
          <Text style={[styles.headerAppName, { color: colors.text }]}>
            Mentrix<Text style={{ color: '#2563eb' }}>OS</Text>
          </Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {instituteName && (
          <Text style={[styles.instituteName, { color: colors.textSecondary }]}>{instituteName}</Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            { backgroundColor: isDashboard ? '#16A34A' : colors.card, borderColor: colors.border }
          ]}
          onPress={onProfilePress}
          disabled={!onProfilePress}
          activeOpacity={0.75}
        >
          <Text style={[styles.avatarText, { color: isDashboard ? '#FDE047' : colors.text }]}>
            {isDashboard ? <Image source={require('../assets/images/student-logo.png')} style={{width: 20, height: 20, tintColor: '#FDE047'}} /> : userInitials}
          </Text>
        </TouchableOpacity>

        {showLogout && (
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: isDark ? colors.error : '#FECACA', backgroundColor: isDark ? '#1F1111' : '#FFF5F5' }]} 
            onPress={onLogout}
          >
            <Image source={logoutIcon} style={[styles.logoutIconStyle, { tintColor: colors.error }]} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tabletHeader: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 38,
    height: 38,
  },
  logoIconSmall: {
    width: 24,
    height: 24,
  },
  headerAppName: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  logoutIconStyle: {
    width: 16,
    height: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
  instituteName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  menuIconStyle: {
    width: 20,
    height: 20,
  },
});
