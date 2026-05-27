/**
 * @fileoverview Primary authentication screen supporting multiple login flows.
 */
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ROUTES } from '../navigation/routes';
import FeatherIcon from 'react-native-vector-icons/Feather';
import BottomSetupCard from '../components/BottomSetupCard';
import { api, Institute, User, Role, BASE_URL } from '../services/api';
import { ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/useTheme';
import OtpComponent from '../components/OtpComponent';
import { APP_STRINGS } from '../constants/strings';

// Icons
const scannerIcon = require('../assets/images/scanner.png');
const googleLogo = require('../assets/images/image.png');


type ViewMode = 'DEFAULT' | 'PHONE' | 'EMAIL_OPTIONS' | 'OTP' | 'PASSWORD';

type LoginContext = {
    user: User;
    institutes: Institute[];
};

type DevCredentialResult =
    | { status: 'invalid' }
    | { status: 'noInstitute'; user: User }
    | ({ status: 'success' } & LoginContext);

const createUser = (email: string, fullName: string): User => ({
    id: email,
    full_name: fullName,
    email,
});

const createRole = (role_id: number, role_name: string): Role => ({
    role_id,
    role_name,
});

const createInstitute = (
    institute_id: number,
    institute_name: string,
    location: string,
    roles: Role[],
    institute_type = 'College',
): Institute => ({
    institute_id,
    institute_name,
    location,
    roles,
    institute_type,
});

const normalizeLoginIdentifier = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.includes('@')) {
        return normalizedValue;
    }

    const demoAliases: Record<string, string> = {
        ayushb: 'ayushb@gmail.com',
        ayushn: 'ayushn@gmail.com',
        divyanshu: 'divyanshu@gmail.com',
        yashd: 'yashd@gmail.com',
        ayushl: 'ayushl@gmail.com',
    };

    return demoAliases[normalizedValue] || normalizedValue;
};

const getDevCredentialContext = (email: string, password: string): DevCredentialResult => {
    if (password !== '123') {
        return { status: 'invalid' };
    }

    const adminRole = createRole(1, 'Admin');
    const teacherRole = createRole(2, 'Teacher');
    const studentRole = createRole(3, 'Student');
    const threeRoleSet = [adminRole, teacherRole, studentRole];
    const twoRoleSet = [adminRole, teacherRole];
    const normalizedEmail = normalizeLoginIdentifier(email);

    switch (normalizedEmail) {
        case 'ayushb@gmail.com':
            return {
                status: 'noInstitute',
                user: createUser(normalizedEmail, 'Ayush B'),
            };
        case 'ayushn@gmail.com':
            return {
                status: 'success',
                user: createUser(normalizedEmail, 'Ayush N'),
                institutes: [
                    createInstitute(1, 'GNIET College of Engineering', 'Nagpur', [adminRole]),
                ],
            };
        case 'divyanshu@gmail.com':
            return {
                status: 'success',
                user: createUser(normalizedEmail, 'Divyanshu'),
                institutes: [
                    createInstitute(2, 'JD College of Engineering', 'Nagpur', [adminRole, teacherRole]),
                ],
            };
        case 'yashd@gmail.com':
            return {
                status: 'success',
                user: createUser(normalizedEmail, 'Yash D'),
                institutes: [
                    createInstitute(3, 'GNIET College of Engineering', 'Nagpur', threeRoleSet),
                    createInstitute(4, 'JD College of Engineering', 'Nagpur', threeRoleSet),
                    createInstitute(5, 'Raisoni College of Engineering', 'Pune', threeRoleSet),
                    createInstitute(6, 'Young Engineering Lab', 'Mumbai', threeRoleSet),
                    createInstitute(7, 'Young Engineering', 'Nagpur', threeRoleSet),
                ],
            };
        case 'ayushl@gmail.com':
            return {
                status: 'success',
                user: createUser(normalizedEmail, 'Ayush L'),
                institutes: [
                    createInstitute(8, 'GNIET College of Engineering', 'Nagpur', twoRoleSet),
                    createInstitute(9, 'Young Engineering Lab', 'Mumbai', twoRoleSet),
                    createInstitute(10, 'Young Engineering', 'Nagpur', twoRoleSet),
                ],
            };
        default:
            return { status: 'invalid' };
    }
};

/**
 * Main Login Screen supporting Phone, Email, OTP, and Password authentication paths.
 * Manages the complex multi-step auth state and dynamic UI rendering.
 * 
 * @returns {React.ReactElement} The LoginScreen component
 */
const LoginScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    // Navigation hook for stack navigation
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    /**
     * STATE MANAGEMENT
     * viewMode: Controls which UI flow is visible (DEFAULT, PHONE, OTP, etc.)
     * inputValue: Stores the raw text from the main input (Email or Phone)
     * otp: Array of 6 digits for the verification code
     */
    const [viewMode, setViewMode] = useState<ViewMode>('DEFAULT');
    const [inputValue, setInputValue] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const [isInputFocused, setIsInputFocused] = useState(false);
    const isRecoverableNetworkError = (message = '') =>
        message.includes('Unable to reach the server') ||
        message.includes('Network request failed') ||
        message.includes('server may be waking up') ||
        message.includes('took too long');
    const screenBackground = isDark ? colors.background : '#F3F4F6';
    const shouldShowAuthBranding = ['DEFAULT', 'PHONE', 'EMAIL_OPTIONS', 'PASSWORD'].includes(viewMode);

    const renderTopActions = () => (
        <View style={styles.tabletHeaderButtons}>
            <TouchableOpacity
                style={[styles.tabletHeaderIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => console.log('Report pressed')}
            >
                <Image
                    source={require('../assets/icons/report-icon.png')}
                    style={[styles.headerIcon, { tintColor: colors.text }]}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabletHeaderIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => toggleTheme()}
            >
                <Image
                    source={require('../assets/logos/dark-mode.png')}
                    style={[styles.headerIcon, { tintColor: colors.text }]}
                />
            </TouchableOpacity>
        </View>
    );

    const renderAuthBranding = () => (
        <View style={styles.defaultBranding}>
            <Image
                source={isDark ? require('../assets/logos/logo-white.png') : require('../assets/logos/logo-black.png')}
                style={styles.defaultLogo}
                resizeMode="contain"
            />
            <Text style={[styles.defaultTitle, { color: colors.text }]}>
                {APP_STRINGS.LOGIN.TITLE_MENTRIX}<Text style={{ color: '#2563EB' }}>{APP_STRINGS.LOGIN.TITLE_OS}</Text>
            </Text>
            <Text style={[styles.defaultSubtitle, { color: colors.text }]}>
                {APP_STRINGS.LOGIN.SUBTITLE_PART1}<Text style={styles.orange}>{APP_STRINGS.LOGIN.SUBTITLE_MENTOR}</Text>{APP_STRINGS.LOGIN.SUBTITLE_PART2}
                <Text style={{ color: '#2563EB', fontWeight: '800' }}>{APP_STRINGS.LOGIN.SUBTITLE_METRICS}</Text>
            </Text>
            <Text style={[styles.defaultDesc, { color: colors.textSecondary }]}>
                {APP_STRINGS.LOGIN.DESC_PART1}<Text style={{ color: colors.text, fontWeight: '800' }}>{APP_STRINGS.LOGIN.DESC_OS}</Text>{APP_STRINGS.LOGIN.DESC_PART2}
            </Text>
        </View>
    );

    /**
     * LOGIC HANDLERS
     */

    // Dynamic view switcher based on whether user types numbers (Phone) or text (Email)
    const handleTextChange = (text: string) => {
        setInputValue(text);

        if (text.length === 0) {
            setPassword('');
            setLoadingText('');
            setViewMode('DEFAULT');
        } else if (/^\d+$/.test(text)) {
            setViewMode('PHONE');
        } else {
            setViewMode('EMAIL_OPTIONS');
        }
    };

    const routeByContext = ({ user, institutes }: LoginContext) => {
        if (institutes.length === 0) {
            console.log('BRANCH: No Access (0 Institutes)');
            Alert.alert(APP_STRINGS.LOGIN.ERR_NO_ACCESS_TITLE, APP_STRINGS.LOGIN.ERR_NO_INSTITUTE);
            return;
        }

        if (institutes.length === 1) {
            const institute = institutes[0];
            const roles = institute.roles || [];

            if (roles.length === 1) {
                console.log("BRANCH: Dashboard (1 Inst, 1 Role)");
                navigation.navigate("Dashboard", {
                    user,
                    institute,
                    role: roles[0],
                });
                return;
            }

            console.log("BRANCH: RoleSelection (1 Inst, Multi-Role)");
            navigation.navigate("RoleSelection", {
                user,
                institute,
                roles,
                institutes,
            });
            return;
        }

        console.log("BRANCH: InstituteSelection (Multi-Inst)");
        navigation.navigate("InstituteSelection", {
            user,
            institutes,
        });
    };

    /**
     * AUTHENTICATION LOGIC (2-Step Flow)
     * STEP 1: Call /auth/login for token and basic user profile
     * STEP 2: Call /auth/my-institutes-roles for context (institutes/roles)
     */
    const handleLogin = async () => {
        if (!inputValue || !password) {
            Alert.alert(APP_STRINGS.ERROR, APP_STRINGS.LOGIN.ERR_MISSING_CREDENTIALS);
            return;
        }

        if (__DEV__) {
            const devContext = getDevCredentialContext(inputValue, password);

            if (devContext.status === 'noInstitute') {
                Alert.alert(APP_STRINGS.LOGIN.ERR_NO_ACCESS_TITLE, APP_STRINGS.LOGIN.ERR_NO_INSTITUTE);
                return;
            }

            if (devContext.status === 'success') {
                routeByContext(devContext);
                return;
            }
        }

        setIsLoading(true);
        setLoadingText('');
        console.log('--- STARTING 2-STEP AUTH FLOW ---');

        const executeLogin = async (isRetry = false) => {
            console.log(isRetry ? 'STEP 1: Retrying Login...' : 'STEP 1: Initiating Login...');
            return await api.login(inputValue.trim().toLowerCase(), password);
        };

        try {
            // -- STEP 1: Get Token & User --
            let authResponse;
            try {
                authResponse = await executeLogin(false);
            } catch (err: any) {
                if (isRecoverableNetworkError(err.message)) {
                    console.log("Server might be sleeping. Retrying...");
                    setLoadingText(APP_STRINGS.LOGIN.WAKING_SERVER);
                    await new Promise<void>(res => setTimeout(res, 3000));
                    authResponse = await executeLogin(true);
                } else {
                    throw err;
                }
            }
            console.log('STEP 1 SUCCESS. Logged in as:', authResponse.data.user.full_name);

            const { token, user } = authResponse.data;

            // -- STEP 2: Fetch Institutes & Roles --
            console.log('STEP 2: Fetching user context (Institutes & Roles)...');
            const contextResponse = await api.getMyInstitutesRoles(token);
            const institutes = contextResponse.data || [];

            console.log('CONTEXT FETCHED. Total Institutes:', institutes.length);
            // Detailed log of specific fields to check for mapping issues
            if (institutes.length > 0) {
                console.log('First Institute Mapping Check:', {
                    id: institutes[0].institute_id,
                    name: institutes[0].institute_name,
                    location: institutes[0].location,
                    rolesCount: institutes[0].roles?.length
                });
            }

            // -- STEP 3: FLOW ROUTING --
            routeByContext({ user, institutes });

        } catch (error: any) {
            console.log("Auth Flow Error:", error.message);
            if (__DEV__ && isRecoverableNetworkError(error.message)) {
                const email = normalizeLoginIdentifier(inputValue);
                const devContext = getDevCredentialContext(email, password);

                if (devContext.status === 'invalid') {
                    Alert.alert(APP_STRINGS.LOGIN.ERR_LOGIN_FAILED, APP_STRINGS.LOGIN.ERR_INCORRECT_CREDENTIALS);
                    return;
                }

                if (devContext.status === 'noInstitute') {
                    Alert.alert(APP_STRINGS.LOGIN.ERR_NO_ACCESS_TITLE, APP_STRINGS.LOGIN.ERR_NO_INSTITUTE);
                    return;
                }

                routeByContext(devContext);
                return;
            }
            Alert.alert(APP_STRINGS.LOGIN.ERR_LOGIN_FAILED, error.message || APP_STRINGS.LOGIN.ERR_UNEXPECTED);
        } finally {
            setIsLoading(false);
            setLoadingText('');
            console.log('--- AUTH FLOW END ---');
        }
    };

    // 3. Render
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: screenBackground }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <ScrollView
                contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {shouldShowAuthBranding && renderTopActions()}

                <View style={[styles.mainContainer, isTablet && styles.tabletMainContainer]}>
                    <View style={[
                        styles.content,
                        shouldShowAuthBranding && styles.defaultContent,
                        isTablet && {
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 32,
                            marginTop: isTablet ? 60 : 40,
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            borderColor: colors.border,
                            borderWidth: 1
                        }
                    ]}>
                        {isTablet && (
                            <View style={styles.tabletBranding}>
                                <Image
                                    source={isDark ? require('../assets/logos/logo-white.png') : require('../assets/logos/logo-black.png')}
                                    style={styles.tabletLogo}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.tabletTitle, { color: colors.text }]}>
                                    {APP_STRINGS.LOGIN.TITLE_MENTRIX}<Text style={{ color: '#2563eb' }}>{APP_STRINGS.LOGIN.TITLE_OS}</Text>
                                </Text>
                                <View style={styles.tabletSubtitleContainer}>
                                    <Text style={[styles.tabletSubtitle, { color: colors.text }]}>
                                        {APP_STRINGS.LOGIN.SUBTITLE_PART1}<Text style={styles.orange}>{APP_STRINGS.LOGIN.SUBTITLE_MENTOR}</Text>{APP_STRINGS.LOGIN.SUBTITLE_PART2}
                                        <Text style={{ color: '#2563eb', fontWeight: '700' }}>{APP_STRINGS.LOGIN.SUBTITLE_METRICS}</Text>
                                    </Text>
                                    <Text style={[styles.tabletDesc, { color: '#64748b' }]}>
                                        {APP_STRINGS.LOGIN.DESC_PART1}<Text style={{ color: colors.text, fontWeight: '700' }}>{APP_STRINGS.LOGIN.DESC_OS}</Text>{APP_STRINGS.LOGIN.DESC_PART2}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {/* --- DYNAMIC INPUT AREA --- */}
                        {shouldShowAuthBranding && renderAuthBranding()}

                        {/* MODE 1: DEFAULT (Phone or Email) */}
                        {viewMode === 'DEFAULT' && (
                            <View style={styles.inputArea}>
                                <TextInput
                                    placeholder={APP_STRINGS.LOGIN.ENTER_PHONE_EMAIL}
                                    placeholderTextColor={colors.placeholder}
                                    style={[
                                        styles.singleInput,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: isInputFocused ? '#3B82F6' : (isDark ? colors.border : colors.inputBorder),
                                            borderWidth: isInputFocused ? 1.5 : 1,
                                            color: colors.text
                                        }
                                    ]}
                                    value={inputValue}
                                    onChangeText={handleTextChange}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <View style={styles.defaultOrContainer}>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                    <Text style={[styles.orText, { color: colors.textSecondary }]}>{APP_STRINGS.OR}</Text>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                </View>
                                <TouchableOpacity style={[styles.joinBtn, styles.authOptionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <Image source={scannerIcon} style={[styles.btnIcon, { tintColor: colors.text }]} />
                                    <Text style={[styles.joinText, { color: colors.text }]}>{APP_STRINGS.LOGIN.JOIN_INSTITUTE}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.joinBtn, styles.authOptionBtn, styles.googleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                                    onPress={() => console.log('Google sign-in pressed')}
                                >
                                    <Image source={googleLogo} style={styles.googleIcon} />
                                    <Text style={[styles.joinText, { color: colors.text }]}>Continue with Google</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* MODE 2: PHONE INPUT */}
                        {viewMode === 'PHONE' && (
                            <View style={styles.inputArea}>
                                <View style={styles.phoneInputRow}>
                                    <View style={[styles.countryPicker, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                        <Text style={styles.flag}>🇮🇳</Text>
                                        <Text style={[styles.countryCode, { color: colors.text }]}>+91</Text>
                                    </View>
                                    <TextInput
                                        placeholder={APP_STRINGS.LOGIN.ENTER_PHONE}
                                        placeholderTextColor={colors.placeholder}
                                        style={[
                                            styles.flexInput,
                                            {
                                                backgroundColor: colors.inputBackground,
                                                borderColor: isInputFocused ? '#3B82F6' : (isDark ? colors.border : colors.inputBorder),
                                                borderWidth: isInputFocused ? 1.5 : 1,
                                                color: colors.text
                                            }
                                        ]}
                                        keyboardType="phone-pad"
                                        value={inputValue}
                                        onChangeText={handleTextChange}
                                        onFocus={() => setIsInputFocused(true)}
                                        onBlur={() => setIsInputFocused(false)}
                                        autoFocus
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.tealBtn, { backgroundColor: colors.success }]}
                                    onPress={() => navigation.navigate(ROUTES.OTP, { phoneNumber: `+91 ${inputValue}` })}
                                >
                                    <Text style={styles.btnText}>{APP_STRINGS.LOGIN.SEND_CODE}</Text>
                                </TouchableOpacity>
                                <View style={styles.orContainer}>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                    <Text style={[styles.orText, { color: colors.textSecondary }]}>{APP_STRINGS.OR}</Text>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                </View>
                                <TouchableOpacity style={[styles.joinBtn, { backgroundColor: isTablet ? colors.inputBackground : colors.card, borderColor: colors.border }]}>
                                    <Text style={[styles.joinText, { color: colors.text }]}>
                                        <Image source={scannerIcon} style={[styles.btnIcon, { tintColor: colors.text }]} /> {APP_STRINGS.LOGIN.JOIN_INSTITUTE}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* MODE 3: EMAIL OPTIONS */}
                        {viewMode === 'EMAIL_OPTIONS' && (
                            <View style={styles.inputArea}>
                                <TextInput
                                    placeholder={APP_STRINGS.LOGIN.ENTER_PHONE_EMAIL}
                                    placeholderTextColor={colors.placeholder}
                                    style={[
                                        styles.singleInput,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: isInputFocused ? '#3B82F6' : (isDark ? colors.border : colors.inputBorder),
                                            borderWidth: isInputFocused ? 1.5 : 1,
                                            color: colors.text
                                        }
                                    ]}
                                    value={inputValue}
                                    onChangeText={handleTextChange}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[styles.halfTealBtn, { backgroundColor: colors.success }]}
                                        onPress={() => setViewMode('OTP')}
                                    >
                                        <Text style={styles.btnTextThin}>{APP_STRINGS.LOGIN.SEND_CODE}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.halfTealBtn, { backgroundColor: colors.success }]}
                                        onPress={() => setViewMode('PASSWORD')}
                                    >
                                        <Text style={styles.btnTextThin}>{APP_STRINGS.LOGIN.USE_PASSWORD}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.orContainer}>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                    <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
                                    <View style={[styles.line, { backgroundColor: isDark ? colors.border : '#333' }]} />
                                </View>
                                <TouchableOpacity style={[styles.joinBtn, { backgroundColor: isTablet ? colors.inputBackground : colors.card, borderColor: colors.border }]}>
                                    <Text style={[styles.joinText, { color: colors.text }]}>
                                        <Image source={scannerIcon} style={[styles.btnIcon, { tintColor: colors.text }]} /> Join Institute
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* MODE 4: OTP INPUT (Shared) */}
                        {viewMode === 'OTP' && (
                            <View style={styles.inputArea}>
                                {inputValue && /^\d+$/.test(inputValue) ? (
                                    <View style={styles.phoneInputRow}>
                                        <View style={[styles.countryPickerSubtle, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                            <Text style={styles.flag}>🇮🇳</Text>
                                            <Text style={[styles.countryCode, { color: colors.text }]}>+91</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.flexInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                                            value={inputValue}
                                            onChangeText={handleTextChange}
                                            keyboardType="phone-pad"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                ) : (
                                    <TextInput
                                        style={[styles.singleInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                                        value={inputValue}
                                        onChangeText={handleTextChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                )}

                                <OtpComponent 
                                    onComplete={(code) => console.log('OTP Entered:', code)}
                                    onResend={() => console.log('Resend code')}
                                />

                                <TouchableOpacity
                                    style={[styles.tealBtn, { backgroundColor: colors.success }]}
                                    onPress={() => {
                                        // Note: In real flow, this would be triggered after OTP API success
                                        // For now, providing placeholder to satisfy TypeScript
                                        navigation.navigate('InstituteSelection', {
                                            user: {
                                                id: 'placeholder',
                                                full_name: 'User',
                                                email: inputValue
                                            },
                                            institutes: []
                                        });
                                    }}
                                >
                                    <Text style={styles.btnText}>{APP_STRINGS.CONTINUE}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* MODE 5: PASSWORD INPUT */}
                        {viewMode === 'PASSWORD' && (
                            <View style={styles.inputArea}>
                                <TextInput
                                    style={[styles.singleInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                                    value={inputValue}
                                    onChangeText={handleTextChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    placeholder={APP_STRINGS.LOGIN.PASSWORD_PLACEHOLDER}
                                    placeholderTextColor={colors.placeholder}
                                    style={[
                                        styles.singleInput,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: isInputFocused ? '#3B82F6' : (isDark ? colors.border : colors.inputBorder),
                                            borderWidth: isInputFocused ? 1.5 : 1,
                                            color: colors.text
                                        }
                                    ]}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    secureTextEntry
                                    autoFocus
                                />
                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={[styles.forgotText, { color: colors.primary }]}>{APP_STRINGS.LOGIN.FORGOT_PASSWORD}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tealBtn, { backgroundColor: colors.success }, isLoading && { opacity: 0.7 }]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <ActivityIndicator color="#FFF" />
                                            {loadingText ? <Text style={styles.btnText}>{loadingText}</Text> : null}
                                        </View>
                                    ) : (
                                        <Text style={styles.btnText}>Continue</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setViewMode('EMAIL_OPTIONS')}
                                >
                                    <Text style={[styles.backText, { color: colors.textSecondary }]}>‹ Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <BottomSetupCard />
            </ScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    tabletScrollContent: {
        alignItems: 'center',
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    mainContainer: {
        width: '100%',
    },
    tabletMainContainer: {
        maxWidth: 560,
        alignSelf: 'center',
    },
    content: {
        width: '100%',
        marginTop: 10,
    },
    defaultContent: {
        marginTop: 56,
    },
    defaultBranding: {
        alignItems: 'center',
        marginBottom: 40,
    },
    defaultLogo: {
        width: 56,
        height: 56,
        marginBottom: 10,
    },
    defaultTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '800',
        marginBottom: 14,
    },
    defaultSubtitle: {
        fontSize: 11,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
    },
    defaultDesc: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabletBranding: {
        alignItems: 'center',
        marginBottom: 8,
    },
    tabletHeaderButtons: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        right: 0,
        gap: 10,
        paddingTop: 16,
        paddingRight: 20,
        zIndex: 100,
    },
    tabletHeaderIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    headerIcon: {
        width: 16,
        height: 16,
    },
    tabletLogo: {
        width: 60,
        height: 60,
        marginBottom: 12,
    },
    tabletTitle: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    tabletSubtitleContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    tabletSubtitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    tabletDesc: {
        fontSize: 12,
        marginTop: 6,
        textAlign: 'center',
    },
    orange: {
        color: '#F97316',
        fontWeight: '700',
    },
    purple: {
        color: '#8B5CF6',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        width: '100%',
    },
    inputArea: {
        width: '100%',
    },
    singleInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 15,
        marginBottom: 22,
        height: 48,
    },
    singleInputDisabled: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 18,
        fontSize: 15,
        marginBottom: 16,
    },
    phoneInputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        marginTop: 4,
    },
    countryPicker: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryPickerSubtle: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: 0.8,
    },
    flag: {
        fontSize: 20,
    },
    countryCode: {
        fontSize: 15,
        fontWeight: '600',
    },
    flexInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 15,
        height: 48,
    },
    flexInputDisabled: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 18,
        fontSize: 15,
    },
    tealBtn: {
        borderRadius: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    halfTealBtn: {
        flex: 1,
        borderRadius: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    btnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFF',
    },
    btnTextThin: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    defaultOrContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 12,
        fontSize: 12,
        fontWeight: '700',
    },
    joinBtn: {
        borderRadius: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    authOptionBtn: {
        flexDirection: 'row',
        gap: 8,
    },
    googleBtn: {
        marginTop: 10,
    },
    joinText: {
        fontSize: 14,
        fontWeight: '800',
    },
    btnIcon: {
        width: 18,
        height: 18,
    },
    googleIcon: {
        width: 18,
        height: 18,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        fontSize: 15,
        fontWeight: '600',
    },
    backButton: {
        alignSelf: 'center',
        marginTop: -12,
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    backText: {
        fontSize: 12,
        fontWeight: '700',
    },
});
