/**
 * @fileoverview Screen allowing users to select their role within a specific institute.
 */
import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    StatusBar,
    Image,
    useWindowDimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Role, User, Institute } from '../services/api';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Icons
const locationIcon = require('../assets/icons/location-icon.png');
const arrowIcon = require('../assets/icons/arow-icon.png');
const backIcon = require('../assets/icons/back-icon.png');
const verifiedIcon = require('../assets/icons/verified-icon.png');

// Local Logo Imports
import gni from '../assets/images/gni-logo.png';
import jd from '../assets/images/jd-logo.png';
import raisoni from '../assets/images/raisoni-logo.png';
import run from '../assets/images/run-logo.png';
import ycce from '../assets/images/ycce-logo.png';

// Role Logos
import adminLogo from '../assets/images/admin-logo.png';
import studentLogo from '../assets/images/student-logo.png';
import trainerLogo from '../assets/images/trainer-logo.png';

type RoleSelectionRouteProp = RouteProp<RootStackParamList, 'RoleSelection'>;

const getInstituteLocation = (item: Partial<Institute>) => (
    item?.location?.trim()
    || [item?.city, item?.state].filter(Boolean).join(", ")
    || "Location N/A"
);

/**
 * Renders a list of roles available to the user for the selected institute.
 * 
 * @returns {React.ReactElement} The RoleSelectionScreen component
 */
const RoleSelectionScreen = () => {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RoleSelectionRouteProp>();

    /**
     * EXTRACT DATA
     * user: Current logged in user profile
     * institute: The institute selected in the previous screen
     * roles: A pre-filtered list of roles for the specific institute selected
     * institutes: The full list of institutes the user has access to (for backtracking)
     */
    const { user, institute, roles, institutes } = route.params;

    /**
     * LOCAL LOGO MAPPING
     * Maps keywords found in institute names to local static assets
     */
    const getLogoSource = (name: string) => {
        const lowerName = (name || '').toLowerCase();
        if (lowerName.includes('gniet') || lowerName.includes('gni')) return gni;
        if (lowerName.includes('rcoem') || lowerName.includes('run')) return run;
        if (lowerName.includes('ycce') || lowerName.includes('young')) return ycce;
        if (lowerName.includes('jd')) return jd;
        if (lowerName.includes('raisoni')) return raisoni;
        return null;
    };

    /**
     * LOGO RENDERING COMPONENT
     * Uses local assets for instant rendering and offline stability
     */
const InstituteLogo = ({ name }: { name: string }) => {
    const logoSource = getLogoSource(name);

    if (!logoSource) {

        let shortName = 'SC';

        const lower = name.toLowerCase();

        if (lower.includes('pune')) shortName = 'YP';
        else if (lower.includes('mumbai')) shortName = 'YM';
        else if (lower.includes('nagpur')) shortName = 'YN';

        return (
            <View
                style={[
                    styles.instituteLogoBg,
                    {
                        backgroundColor: '#2563EB',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Text
                    style={{
                        color: '#FFF',
                        fontWeight: '700',
                        fontSize: 16,
                    }}
                >
                    {shortName}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.instituteLogoBg}>
            <Image
                source={logoSource}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>
    );
};

    const renderSelectedInstitute = () => (
        <View style={styles.selectedSection}>
            {institutes.length > 1 && (
                <TouchableOpacity
                    style={[styles.changeInstBtn, { backgroundColor: isDark ? colors.card : '#F1F5F9', borderColor: isDark ? colors.border : '#E2E8F0' }]}
                    onPress={() => navigation.navigate('InstituteSelection', { user, institutes })}
                >
                    <Text style={[styles.changeInstText, { color: isDark ? '#FFF' : '#1E3A8A' }]}>
                        <Image source={backIcon} style={[styles.backIcon, { tintColor: isDark ? '#FFF' : '#1E3A8A' }]} /> Change Institute
                    </Text>
                </TouchableOpacity>
            )}

            <View style={[styles.selectedCard, { backgroundColor: isDark ? colors.tealLight : '#EBF3FF', borderColor: isDark ? colors.teal : '#A3C8FF' }]}>
                <View style={styles.cardLeft}>
                    <InstituteLogo name={institute.institute_name || institute.name || ''} />
                </View>
                <View style={styles.cardCenter}>
                    <Text style={[styles.instituteName, { color: isDark ? '#FFF' : '#1e1b4b' }]}>{institute.institute_name || institute.name}</Text>
                    <View style={styles.locationRow}>
                        <Image source={locationIcon} style={[styles.locIcon, { tintColor: isDark ? '#CBD5E1' : '#94a3b8' }]} />
                        <Text style={[styles.locationText, { color: isDark ? '#CBD5E1' : '#64748b' }]}>{getInstituteLocation(institute)}</Text>
                    </View>
                </View>
                <Image source={verifiedIcon} style={styles.verifiedIconStyle} />
            </View>
        </View>
    );

    const renderTitle = () => {
        const instName = institute?.institute_name || institute?.name || "the Institute";
        return (
            <View style={styles.titleSection}>
                <Text style={[styles.titleText, { color: isDark ? colors.text : '#102A63' }]}>Choose Your Role</Text>
                <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                    Select how you'd like to access {instName}
                </Text>
            </View>
        );
    };

    const getRoleLogo = (roleName: string) => {
        const lowerName = (roleName || '').toLowerCase();
        if (lowerName.includes('admin')) return adminLogo;
        if (lowerName.includes('student')) return studentLogo;
        if (
            lowerName.includes('teacher') ||
            lowerName.includes('faculty') ||
            lowerName.includes('lecturer') ||
            lowerName.includes('professor') ||
            lowerName.includes('tutor') ||
            lowerName.includes('staff') ||
            lowerName.includes('trainer') ||
            lowerName.includes('instructor')
        ) return trainerLogo;

        console.log(`[Role Mapping] No local icon found for: "${roleName}"`);
        return null;
    };

    const renderRoleItem = ({ item }: { item: Role }) => {
        const name = item?.role_name || (item as any)?.name || "User";
        const description = item?.description || "Select to enter dashboard";
        const roleLogo = getRoleLogo(name);

        return (
            <Pressable
                style={({ pressed, hovered }: any) => [
                    styles.roleCard, 
                    { 
                        backgroundColor: colors.card,
                        borderColor: hovered || pressed ? colors.primary : colors.border,
                        opacity: pressed ? 0.7 : 1,
                    }
                ]}
                onPress={() => {
                    navigation.navigate('Dashboard', {
                        user,
                        institute,
                        role: item
                    });
                }}
            >
                <View style={styles.roleIconContainer}>
                    {roleLogo ? (
                        <Image source={roleLogo} style={styles.roleLogoImage} resizeMode="contain" />
                    ) : (
                        <FeatherIcon name={(item.icon || 'user') as any} size={24} color={item.accentColor || colors.primary} />
                    )}
                </View>
                <View style={styles.roleContent}>
                    <Text style={[styles.roleName, { color: isDark ? colors.text : '#102A63' }]} numberOfLines={1}>{name}</Text>
                    <Text style={[styles.roleDesc, { color: colors.textSecondary }]} numberOfLines={1}>{description}</Text>
                </View>
                <View style={[styles.arrowBox, { backgroundColor: isDark ? colors.inputBackground : '#F1F5F9', borderColor: isDark ? colors.border : 'transparent' }]}>
                    <Image source={arrowIcon} style={[styles.arrowIcon, { tintColor: isDark ? colors.text : '#102A63' }]} />
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <Header user={user} />
            <View style={[styles.mainWrapper, isTablet && styles.tabletWrapper]}>

                <FlatList
                    data={roles}
                    keyExtractor={(item) => String(item.role_id || (item as any).id)}
                    renderItem={renderRoleItem}
                    contentContainerStyle={[styles.listContent, isTablet && styles.tabletListContent]}
                    ListHeaderComponent={() => (
                        <>
                            {renderSelectedInstitute()}
                            {renderTitle()}
                        </>
                    )}
                    ListFooterComponent={() => <Footer type="role" />}
                    ListFooterComponentStyle={isTablet ? styles.tabletFooter : undefined}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainWrapper: {
        flex: 1,
        paddingHorizontal: 24,
    },
    tabletWrapper: {
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    selectedSection: {
        marginTop: 16,
        marginBottom: 24,
    },
    changeInstBtn: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        borderWidth: 1,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeInstText: {
        fontSize: 14,
        fontWeight: '600',
    },
    backIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    selectedCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    cardLeft: {
        marginRight: 16,
    },
    verifiedIconStyle: {
        width: 24,
        height: 24,
    },
    instituteLogoBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#FFF',
    },
    logoImage: {
        width: 38,
        height: 38,
        borderRadius: 8,
    },
    cardCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    instituteName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locIcon: {
        width: 12,
        height: 12,
    },
    locationText: {
        fontSize: 13,
        fontWeight: '500',
    },
    titleSection: {
        marginBottom: 24,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitleText: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    tabletListContent: {
        flexGrow: 1,
    },
    tabletFooter: {
        marginTop: 'auto',
    },
    roleCard: {
        flexDirection: 'row',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 18,
        marginBottom: 14,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    roleIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        overflow: 'hidden',
    },
    roleLogoImage: {
        width: 44,
        height: 44,
    },
    roleContent: {
        flex: 1,
    },
    roleName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    roleDesc: {
        fontSize: 13,
        fontWeight: '500',
    },
    arrowBox: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 32,
        height: 32,
    },
    arrowIcon: {
        width: 16,
        height: 16,
    },
});
