/**
 * @fileoverview Reusable dashboard statistic card component.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Props for the DashboardCard component.
 */
interface DashboardCardProps {
  /** The primary large text value (e.g., a number or metric) */
  title: string;
  /** The subtitle labeling the metric */
  subtitle: string;
  /** Optional detailed description of the metric */
  description?: string;
  /** The background color for the card */
  backgroundColor: string;
  /** The accent color for text and icons inside the card */
  accentColor: string;
}

/**
 * Renders a stylized statistic card for the dashboard.
 * 
 * @param {DashboardCardProps} props - The component props
 * @returns {React.ReactElement} The DashboardCard component
 */
const DashboardCard = ({ title, subtitle, description, backgroundColor, accentColor }: DashboardCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: accentColor }]}>{subtitle}</Text>
      {description && <Text style={[styles.description, { color: accentColor }]}>{description}</Text>}
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    opacity: 0.8,
  },
});
