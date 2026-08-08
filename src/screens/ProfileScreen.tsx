import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { Colors, Typography, Spacing } from '../theme/colors';
import { mockFarmerProfile } from '../data/mockData';
import { useTranslation, LanguageInfo } from '../i18n';
import { useAuth } from '../hooks/useAuth';

export const ProfileScreen = ({ navigation }: any) => {
  const { t, language, setLanguage, supportedLanguages, currentLanguageInfo, isRTL } = useTranslation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    setIsLangModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const locationDisplay = user
    ? `${user.location}, ${user.district}, ${user.state}`
    : mockFarmerProfile.location;

  const primaryCrops = user?.primaryCrops || mockFarmerProfile.primaryCrops || ['Wheat', 'Rice'];
  const soilTypes = user?.soilTypes || mockFarmerProfile.soilTypes || ['Loam Soil'];
  const farmSize = user?.farmSizeAcres || mockFarmerProfile.farmSizeAcres || 12.5;

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={t('profileSettings')}
        subtitle={t('farmDetails')}
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨‍🌾</Text>
          </View>
          <Text style={styles.farmerName}>{user?.name || 'Farmer Profile'}</Text>
          <Text style={styles.locationText}>📍 {locationDisplay}</Text>
          <Badge
            label={`${t('memberSince')} ${user?.memberSince || '2026'}`}
            variant="success"
            style={styles.memberBadge}
          />
        </View>

        {/* Language Selector Bar */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌐 {t('language')}</Text>
          <TouchableOpacity
            style={[styles.settingRowClick, isRTL && styles.rowRTL]}
            activeOpacity={0.8}
            onPress={() => setIsLangModalOpen(true)}>
            <View style={isRTL && styles.alignRight}>
              <Text style={styles.settingTitle}>{t('selectLanguage')}</Text>
              <Text style={styles.langValueHighlight}>
                {currentLanguageInfo.nativeName} ({currentLanguageInfo.name})
              </Text>
            </View>
            <View style={styles.changeBadge}>
              <Text style={styles.changeBadgeText}>Change ›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Farm Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <Text style={styles.specIcon}>🚜</Text>
            <Text style={styles.specVal}>{farmSize} Acres</Text>
            <Text style={styles.specLabel}>{t('farmSize')}</Text>
          </View>

          <View style={styles.specBox}>
            <Text style={styles.specIcon}>🌱</Text>
            <Text style={styles.specVal}>{primaryCrops.length} Crops</Text>
            <Text style={styles.specLabel}>{t('primaryCrops')}</Text>
          </View>

          <View style={styles.specBox}>
            <Text style={styles.specIcon}>🧱</Text>
            <Text style={styles.specVal}>{soilTypes[0]}</Text>
            <Text style={styles.specLabel}>{t('soilTypes')}</Text>
          </View>
        </View>

        {/* Active Crops Tags */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌾 {t('primaryCrops')}</Text>
          <View style={styles.chipContainer}>
            {primaryCrops.map((crop, idx) => (
              <View key={idx} style={styles.cropChip}>
                <Text style={styles.cropChipText}>🌱 {crop}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📞 {t('contactPhone')}</Text>
          <View style={[styles.infoRow, isRTL && styles.rowRTL]}>
            <Text style={styles.infoLabel}>{t('contactPhone')}</Text>
            <Text style={styles.infoValue}>{mockFarmerProfile.phone}</Text>
          </View>
          <View style={[styles.infoRow, isRTL && styles.rowRTL]}>
            <Text style={styles.infoLabel}>{t('contactEmail')}</Text>
            <Text style={styles.infoValue}>{mockFarmerProfile.email}</Text>
          </View>
        </View>

        {/* Settings & Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ {t('profileSettings')}</Text>

          <View style={[styles.settingRow, isRTL && styles.rowRTL]}>
            <View style={isRTL && styles.alignRight}>
              <Text style={styles.settingTitle}>Weather & Mandi Push Alerts</Text>
              <Text style={styles.settingSub}>Receive daily forecast & price updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.successLight }}
              thumbColor={notifications ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={[styles.settingRow, isRTL && styles.rowRTL]}>
            <View style={isRTL && styles.alignRight}>
              <Text style={styles.settingTitle}>Irrigation SMS Alerts</Text>
              <Text style={styles.settingSub}>Soil moisture threshold notifications</Text>
            </View>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              trackColor={{ false: Colors.border, true: Colors.successLight }}
              thumbColor={smsAlerts ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        {/* Support & Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Language Selection Modal (All 22 Eighth Schedule Languages) */}
      <Modal
        visible={isLangModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLangModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌐 {t('selectLanguage')}</Text>
              <Text style={styles.modalSub}>
                All 22 Eighth Schedule Languages of the Indian Constitution Supported
              </Text>
            </View>

            <FlatList
              data={supportedLanguages}
              keyExtractor={(item: LanguageInfo) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: { item: LanguageInfo }) => {
                const isSelected = language === item.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.langOptionRow,
                      isSelected && styles.langOptionSelected,
                    ]}
                    onPress={() => handleSelectLanguage(item.code)}>
                    <View style={styles.langLeft}>
                      <Text style={[styles.nativeNameText, isSelected && styles.nativeSelectedText]}>
                        {item.nativeName}
                      </Text>
                      <Text style={styles.englishNameText}>
                        {item.name} {item.isRTL ? ' (RTL)' : ''}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsLangModalOpen(false)}>
              <Text style={styles.modalCloseText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  profileHeaderCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  farmerName: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  locationText: {
    fontSize: Typography.bodySize,
    color: '#D1D5DB',
    marginTop: 2,
  },
  memberBadge: {
    marginTop: Spacing.xs,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  specBox: {
    width: '31%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specIcon: {
    fontSize: 22,
  },
  specVal: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  specLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  cropChip: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  cropChipText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weightMedium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Typography.bodySize,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingRowClick: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  settingSub: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginTop: 2,
  },
  langValueHighlight: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
    marginTop: 2,
  },
  changeBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  logoutBtn: {
    backgroundColor: Colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  langOptionSelected: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
  },
  langLeft: {
    flex: 1,
  },
  nativeNameText: {
    fontSize: Typography.bodySize + 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  nativeSelectedText: {
    color: Colors.primary,
  },
  englishNameText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  modalCloseText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
});

export default ProfileScreen;
