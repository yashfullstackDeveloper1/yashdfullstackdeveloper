/**
 * @fileoverview Reusable OTP (One-Time Password) input component.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/useTheme';

/**
 * Props for the OtpComponent.
 */
interface OtpComponentProps {
  /** Callback fired when the OTP input is fully populated */
  onComplete?: (otp: string) => void;
  /** Callback fired when the user requests to resend the code */
  onResend?: () => void;
  /** The expected length of the OTP code. Defaults to 6. */
  length?: number;
}

/**
 * Renders a segmented OTP input field with automatic focus management.
 * 
 * @param {OtpComponentProps} props - The component props
 * @returns {React.ReactElement} The OtpComponent
 */
const OtpComponent: React.FC<OtpComponentProps> = ({ 
  onComplete, 
  onResend,
  length = 6 
}) => {
  const { colors } = useTheme();
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.otpTitle, { color: colors.textSecondary }]}>Enter {length}-digit code</Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => {
          const isFocused = focusedIndex === index;
          return (
            <TextInput
              key={index}
              style={[
                styles.otpBox, 
                { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: isFocused ? colors.primary : colors.border, 
                  borderWidth: isFocused ? 1.5 : 1,
                  color: colors.text 
                }
              ]}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
              ref={(ref) => { inputs.current[index] = ref; }}
            />
          );
        })}
      </View>

      <View style={styles.resendRow}>
        <Text style={[styles.resendLabel, { color: colors.textSecondary }]}>Didn't get Code? </Text>
        <TouchableOpacity onPress={onResend}>
          <Text style={[styles.resendLink, { color: colors.primary }]}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  otpTitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 15,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
