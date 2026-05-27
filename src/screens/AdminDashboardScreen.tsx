/**
 * @fileoverview Main administrative dashboard displaying high-level statistics.
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    useWindowDimensions,
} from 'react-native';
import DashboardCard from '../components/DashboardCard';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import { APP_STRINGS } from '../constants/strings';

// Icons

type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

/**
 * Renders the admin dashboard with overview metrics like total users and active institutes.
 * 
 * @returns {React.ReactElement} The AdminDashboardScreen component
 */
const AdminDashboardScreen = () => {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const route = useRoute<DashboardRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    /**
     * DATA CONSUMPTION
     * user: Profile data of the logged-in user
     * institute: The specific institute context for this session
     * role: The specific role (Admin/Teacher/Student) active for this session
     */
    const { user, institute, role } = route.params;

    // Generate initials for the profile avatar (e.g., "John Doe" -> "JD")
    const displayName = user.full_name || user.name || 'User';
    const userInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    // Safety logout: returns the user to the Login screen and clears the navigation stack
    const handleLogout = () => {
        navigation.replace('Login' as any);
    };

    const renderGreeting = () => (
        <View style={styles.greetingSection}>
            <Text style={[styles.greetingHeading, { color: isDark ? colors.text : '#102A63' }]}>{APP_STRINGS.DASHBOARD.GREETING_HEY} {(user.full_name || user.name || 'User').split(' ')[0]} {APP_STRINGS.DASHBOARD.GREETING_EMOJI}</Text>
            <Text style={[styles.greetingSub, { color: isDark ? colors.text : '#102A63' }]}>{APP_STRINGS.DASHBOARD.WELCOME_PREFIX} {role.role_name || (role as any).name} {APP_STRINGS.DASHBOARD.WELCOME_SUFFIX}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <Header
                user={user}
                showMenu={false}
                onProfilePress={handleLogout}
                showAppName={true}
                isDashboard={true}
            />

            <View style={[styles.mainContent, isTablet && styles.tabletMainWrapper]}>

                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, isTablet && styles.tabletScrollContainer]}
                    showsVerticalScrollIndicator={false}
                >
                    {renderGreeting()}

                    <View style={[styles.cardList, isTablet && styles.tabletCardGrid]}>
                        <View style={isTablet ? styles.tabletCardItem : null}>
                            <DashboardCard
                                title="08"
                                subtitle={APP_STRINGS.DASHBOARD.ACTIVE_INSTITUTES}
                                description={APP_STRINGS.DASHBOARD.ACTIVE_INSTITUTES_DESC}
                                backgroundColor={isDark ? '#051933' : '#F0F7FF'}
                                accentColor={isDark ? '#60A5FA' : '#2563EB'}
                            />
                        </View>

                        <View style={isTablet ? styles.tabletCardItem : null}>
                            <DashboardCard
                                title="03"
                                subtitle={APP_STRINGS.DASHBOARD.INACTIVE_INSTITUTES}
                                description={APP_STRINGS.DASHBOARD.INACTIVE_INSTITUTES_DESC}
                                backgroundColor={isDark ? '#062016' : '#F0FDF4'}
                                accentColor={isDark ? '#4ADE80' : '#16A34A'}
                            />
                        </View>

                        <View style={isTablet ? styles.tabletCardItem : null}>
                            <DashboardCard
                                title="15+"
                                subtitle={APP_STRINGS.DASHBOARD.TOTAL_MODULES}
                                description={APP_STRINGS.DASHBOARD.TOTAL_MODULES_DESC}
                                backgroundColor={isDark ? '#2A1205' : '#FFF7ED'}
                                accentColor={isDark ? '#FB923C' : '#EA580C'}
                            />
                        </View>

                        <View style={isTablet ? styles.tabletCardItem : null}>
                            <DashboardCard
                                title="50+"
                                subtitle={APP_STRINGS.DASHBOARD.TOTAL_USERS}
                                description={APP_STRINGS.DASHBOARD.TOTAL_USERS_DESC}
                                backgroundColor={isDark ? '#1E1B4B' : '#F5F3FF'}
                                accentColor={isDark ? '#A78BFA' : '#7C3AED'}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
    },
    tabletMainWrapper: {
        maxWidth: 1000,
        width: '100%',
        alignSelf: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    tabletScrollContainer: {
        paddingHorizontal: 40,
    },
    greetingSection: {
        marginTop: 40,
        marginBottom: 32,
        alignItems: 'center',
    },
    greetingHeading: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    greetingSub: {
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        maxWidth: '90%',
    },
    cardList: {
        gap: 12,
    },
    tabletCardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 20,
    },
    tabletCardItem: {
        width: '48%',
    },
});
