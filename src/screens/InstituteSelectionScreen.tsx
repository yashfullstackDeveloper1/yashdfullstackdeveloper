/**
 * @fileoverview Screen allowing users to select which institute they want to access.
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Institute, User, Role } from '../services/api';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Local Assets
import gni from '../assets/images/gni-logo.png';
import jd from '../assets/images/jd-logo.png';
import raisoni from '../assets/images/raisoni-logo.png';
import run from '../assets/images/run-logo.png';
import ycce from '../assets/images/ycce-logo.png';

// Icons
const locationIcon = require('../assets/icons/location-icon.png');
const arrowIcon = require('../assets/icons/arow-icon.png');
const searchIcon = require('../assets/icons/search-icon.png');

type InstituteSelectionRouteProp = RouteProp<RootStackParamList, 'InstituteSelection'>;

/**
 * Renders a searchable list of institutes that the authenticated user has access to.
 * Navigates to role selection or directly to dashboard based on role count.
 * 
 * @returns {React.ReactElement} The InstituteSelectionScreen component
 */
const InstituteSelectionScreen = () => {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<InstituteSelectionRouteProp>();
    const { user, institutes } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filteredInstitutes = (institutes || []).filter((item: any) => {
        const safeName = item?.institute_name || item?.name || "Unknown Institute";
        const safeLocation = item?.location || [item?.city, item?.state].filter(Boolean).join(", ") || "Location N/A";
        const search = (searchQuery || '').toLowerCase();
        return safeName.toLowerCase().includes(search) || safeLocation.toLowerCase().includes(search);
    });

    const handleSelectInstitute = (institute: Institute) => {
        const roles = institute.roles || [];
        if (roles.length === 1) {
            navigation.navigate('Dashboard', { user, institute, role: roles[0] });
        } else {
            navigation.navigate('RoleSelection', { user, institute, roles, institutes });
        }
    };

    const getLogoSource = (name: string) => {
        const lowerName = (name || '').toLowerCase();
        if (lowerName.includes('gniet') || lowerName.includes('gni')) return gni;
        if (lowerName.includes('rcoem') || lowerName.includes('run')) return run;
        if (lowerName.includes('ycce')) return ycce;
        if (lowerName.includes('jd')) return jd;
        if (lowerName.includes('raisoni')) return raisoni;
        return null;
    };

    const renderGreeting = () => (
        <View style={styles.greetingSection}>
            <Text style={[styles.greetingTitle, { color: colors.text }]}>Hi, {(user.full_name || user.name || 'User').split(' ')[0]} ! 👋</Text>
            <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
                Select your institute to access your personalized dashboard
            </Text>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <View style={[
                styles.searchBox,
                {
                    backgroundColor: colors.inputBackground,
                    borderColor: isSearchFocused ? colors.primary : colors.border,
                    borderWidth: isSearchFocused ? 1.5 : 1
                }
            ]}>
                <Image source={searchIcon} style={[styles.searchIcon, { tintColor: colors.placeholder }]} />
                <TextInput
                    placeholder="Search your institute"
                    placeholderTextColor={colors.placeholder}
                    style={[styles.searchInput, { color: colors.text }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
            </View>
        </View>
    );

    const renderInstituteItem = ({ item }: { item: Institute }) => {
        const title = item?.institute_name || item?.name || "Unknown Institute";
        const locationText = item?.location || [item?.city, item?.state].filter(Boolean).join(", ") || "Location N/A";
        const type = item?.institute_type || "School"; // Fallback as per screenshot
        const logoSource = getLogoSource(title);

        return (
            <Pressable
                style={({ pressed, hovered }: any) => [
                    styles.card,
                    {
                        backgroundColor: colors.card,
                        borderColor: hovered || pressed ? colors.primary : colors.border,
                        opacity: pressed ? 0.7 : 1,
                    }
                ]}
                onPress={() => handleSelectInstitute(item)}
            >
                <View style={styles.cardInner}>
                    {/* Left: Logo */}
                   <View style={styles.logoBox}>
  {logoSource ? (
    <Image
      source={logoSource}
      style={styles.logoImage}
      resizeMode="contain"
    />
  ) : (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#374151',
        }}
      >
        {(() => {
          const words = title?.split(' ') || [];

          const first = words[0]?.[0] || '';
          const last = words[words.length - 1]?.[0] || '';

          return `${first}${last}`.toUpperCase();
        })()}
      </Text>
    </View>
  )}
</View>

                    {/* Center: Info */}
                    <View style={styles.cardCenter}>
                        <Text style={[styles.instituteName, { color: colors.text }]} numberOfLines={1}>{title}</Text>
                        <View style={styles.locationRow}>
                            <Image source={locationIcon} style={[styles.locIcon, { tintColor: colors.placeholder }]} />
                            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>{locationText}</Text>
                        </View>
                    </View>

                    {/* Right: Type + Arrow */}
                    <View style={styles.cardRight}>
                        <Text style={[styles.typeText, { color: colors.textSecondary }]}>{type}</Text>
                        <View style={[styles.arrowButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                            <Image source={arrowIcon} style={[styles.arrowIcon, { tintColor: colors.text }]} />
                        </View>
                    </View>
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
                    data={filteredInstitutes}
                    keyExtractor={(item) => String(item.institute_id || item.id)}
                    renderItem={renderInstituteItem}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={() => (
                        <>
                            {renderGreeting()}
                            {institutes.length >= 5 && renderSearchBar()}
                        </>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.placeholder }]}>No institutes found.</Text>
                        </View>
                    )}
                    ListFooterComponent={() => <Footer />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainWrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    tabletWrapper: {
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    greetingSection: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    greetingTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 10,
    },
    greetingSubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
        fontWeight: '500',
    },
    searchContainer: {
        marginBottom: 24,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
    },
    searchIcon: {
        width: 28,
        height: 28,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        borderRadius: 12,
        marginBottom: 12,
        padding: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoBox: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 40,
        height: 40,
    },
    fallbackLogo: {
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    cardCenter: {
        flex: 1,
        marginLeft: 14,
    },
    instituteName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locIcon: {
        width: 14,
        height: 14,
        marginRight: 4,
    },
    locationText: {
        fontSize: 13,
        fontWeight: '500',
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    arrowButton: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 6,
    },
    arrowIcon: {
        width: 16,
        height: 16,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    },
});

export default InstituteSelectionScreen;
