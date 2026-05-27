/**
 * @fileoverview Generic footer component for selection screens.
 */
import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../theme/useTheme';

/**
 * Props for the Footer component.
 */
interface FooterProps {
  /** The type of selection context (institute or role) */
  type?: 'institute' | 'role';
}

/**
 * Renders a support footer with a contact email link.
 * 
 * @param {FooterProps} props - The component props
 * @returns {React.ReactElement} The Footer component
 */
const Footer: React.FC<FooterProps> = ({ type = 'institute' }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.footerContainer, { borderTopColor: colors.border }]}>
      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        Can't find your {type}? Contact your institute administrator or email us at{' '}
        <Text 
          style={{ color: colors.primary }} 
          onPress={() => Linking.openURL('mailto:support@schoolcoreos.com')}
        >
          support@schoolcoreos.com
        </Text>
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
});
