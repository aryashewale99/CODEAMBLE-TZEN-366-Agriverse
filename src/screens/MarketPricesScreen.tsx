import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { SearchBar } from '../components/SearchBar';
import { Colors, Typography, Spacing } from '../theme/colors';
import { marketService } from '../services/marketService';
import { AgmarknetRecord } from '../types/agri';
import { AGMARKNET_CONFIG } from '../config/apiConfig';

const POPULAR_STATES = [
  'All',
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Maharashtra',
  'Rajasthan',
  'Gujarat',
  'Madhya Pradesh',
  'Odisha',
  'Tripura',
  'Tamil Nadu',
  'Karnataka',
  'West Bengal',
  'Bihar',
];

const POPULAR_COMMODITIES = [
  'All',
  'Wheat',
  'Paddy(Dhan)',
  'Rice',
  'Potato',
  'Tomato',
  'Onion',
  'Cotton',
  'Mustard',
  'Maize',
  'Banana',
  'Apple',
  'Bhindi(Ladies Finger)',
  'Brinjal',
  'Soyabean',
];

export const MarketPricesScreen = ({ navigation }: any) => {
  const [records, setRecords] = useState<AgmarknetRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dropdown Modals
  const [activeDropdown, setActiveDropdown] = useState<'state' | 'district' | 'commodity' | null>(null);
  const [selectedItem, setSelectedItem] = useState<AgmarknetRecord | null>(null);
  const [historicalTrend, setHistoricalTrend] = useState<AgmarknetRecord[]>([]);
  const [loadingTrend, setLoadingTrend] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await marketService.fetchMandiPrices({
        state: selectedState,
        district: selectedDistrict,
        commodity: selectedCommodity,
        limit: AGMARKNET_CONFIG.defaultLimit,
      });
      setRecords(res.records || []);
    } catch (err: any) {
      console.error('Agmarknet API fetch failed:', err);
      setError('Market data unavailable');
      setRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedState, selectedDistrict, selectedCommodity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Dynamically extract districts for selected state
  const availableDistricts = React.useMemo(() => {
    const list = ['All'];
    records.forEach((r) => {
      if (r.district && !list.includes(r.district)) {
        list.push(r.district);
      }
    });
    return list;
  }, [records]);

  // Client-side text search filter
  const filteredRecords = React.useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter((r) => {
      return (
        r.commodity?.toLowerCase().includes(q) ||
        r.market?.toLowerCase().includes(q) ||
        r.district?.toLowerCase().includes(q) ||
        r.state?.toLowerCase().includes(q) ||
        r.variety?.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery]);

  // When card selected, fetch historical records for trend
  const handleSelectItem = async (item: AgmarknetRecord) => {
    setSelectedItem(item);
    setLoadingTrend(true);
    try {
      const trend = await marketService.fetchHistoricalPrices(item.commodity, 60);
      const matched = trend.filter(
        (t) => t.commodity === item.commodity && (t.market === item.market || t.state === item.state)
      );
      setHistoricalTrend(matched.length > 0 ? matched : trend.slice(0, 7));
    } catch {
      setHistoricalTrend([]);
    } finally {
      setLoadingTrend(false);
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Live Mandi Prices"
        subtitle="Official Govt of India Agmarknet Telemetry"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={onRefresh} style={styles.refreshIconBtn}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }>
        
        {/* Source Attribution Header */}
        <View style={styles.sourceBanner}>
          <View style={styles.sourceHeaderRow}>
            <Text style={styles.sourceIcon}>🏛️</Text>
            <Text style={styles.sourceTitle}>{AGMARKNET_CONFIG.sourceLabel}</Text>
          </View>
          <Text style={styles.sourceSubtitle}>
            Daily mandi arrival prices updated directly from APMCs across India.
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search commodity, mandi, district or state..."
          style={styles.searchSpacing}
        />

        {/* Filter Dropdown Buttons Row */}
        <View style={styles.filtersRow}>
          {/* State Select */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setActiveDropdown('state')}>
            <Text style={styles.filterLabel}>State:</Text>
            <Text style={styles.filterValue} numberOfLines={1}>
              {selectedState}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>

          {/* District Select */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setActiveDropdown('district')}>
            <Text style={styles.filterLabel}>District:</Text>
            <Text style={styles.filterValue} numberOfLines={1}>
              {selectedDistrict}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>

          {/* Commodity Select */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setActiveDropdown('commodity')}>
            <Text style={styles.filterLabel}>Crop:</Text>
            <Text style={styles.filterValue} numberOfLines={1}>
              {selectedCommodity}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content States */}
        {loading && !refreshing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching real-time Agmarknet mandi data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>{error}</Text>
            <Text style={styles.errorSub}>
              Failed to load government mandi price data. Please check your internet connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : filteredRecords.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🌾</Text>
            <Text style={styles.emptyTitle}>No Mandi Market Prices Found</Text>
            <Text style={styles.emptySub}>
              No APMC records found matching your selected state/crop filters. Try clearing filters.
            </Text>
            <TouchableOpacity
              style={styles.clearFilterBtn}
              onPress={() => {
                setSelectedState('All');
                setSelectedDistrict('All');
                setSelectedCommodity('All');
                setSearchQuery('');
              }}>
              <Text style={styles.clearFilterText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Section 1: Latest Available Prices */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>Latest Available Prices</Text>
              <Text style={styles.recordCountText}>
                {filteredRecords.length} Mandi Records
              </Text>
            </View>

            {filteredRecords.map((item, index) => (
              <TouchableOpacity
                key={`${item.market}-${item.commodity}-${index}`}
                style={styles.recordCard}
                activeOpacity={0.85}
                onPress={() => handleSelectItem(item)}>
                
                {/* Top Row: Commodity & Modal Price */}
                <View style={styles.cardTopRow}>
                  <View style={styles.leftTitleBox}>
                    <Text style={styles.commodityName}>{item.commodity}</Text>
                    <Text style={styles.mandiLocation}>
                      📍 {item.market}, {item.district}, {item.state}
                    </Text>
                  </View>

                  <View style={styles.rightPriceBox}>
                    <Text style={styles.modalPriceValue}>
                      ₹{Number(item.modal_price).toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.priceUnitLabel}>₹ / Quintal</Text>
                  </View>
                </View>

                {/* Details Breakdown Row */}
                <View style={styles.priceBreakdownRow}>
                  <View style={styles.pricePill}>
                    <Text style={styles.pricePillLabel}>Min Price</Text>
                    <Text style={styles.pricePillVal}>
                      ₹{Number(item.min_price).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.pricePill}>
                    <Text style={styles.pricePillLabel}>Max Price</Text>
                    <Text style={styles.pricePillVal}>
                      ₹{Number(item.max_price).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.pricePillHighlight}>
                    <Text style={styles.pricePillLabelHighlight}>Modal Rate</Text>
                    <Text style={styles.pricePillValHighlight}>
                      ₹{Number(item.modal_price).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Card Footer Info */}
                <View style={styles.cardFooter}>
                  <View style={styles.tagGroup}>
                    <Badge label={`Variety: ${item.variety}`} variant="primary" />
                    {item.grade ? (
                      <View style={styles.gradeBadge}>
                        <Text style={styles.gradeText}>Grade: {item.grade}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.arrivalDateText}>
                    📅 Arrival Date: {item.arrival_date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Options Modal */}
      <Modal
        visible={!!activeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveDropdown(null)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveDropdown(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>
              Select {activeDropdown === 'state' ? 'State' : activeDropdown === 'district' ? 'District' : 'Commodity'}
            </Text>

            <FlatList
              data={
                activeDropdown === 'state'
                  ? POPULAR_STATES
                  : activeDropdown === 'district'
                  ? availableDistricts
                  : POPULAR_COMMODITIES
              }
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected =
                  (activeDropdown === 'state' && selectedState === item) ||
                  (activeDropdown === 'district' && selectedDistrict === item) ||
                  (activeDropdown === 'commodity' && selectedCommodity === item);

                return (
                  <TouchableOpacity
                    style={[styles.modalOptionRow, isSelected && styles.modalOptionSelected]}
                    onPress={() => {
                      if (activeDropdown === 'state') setSelectedState(item);
                      if (activeDropdown === 'district') setSelectedDistrict(item);
                      if (activeDropdown === 'commodity') setSelectedCommodity(item);
                      setActiveDropdown(null);
                    }}>
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <Text style={styles.checkmarkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveDropdown(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Mandi Record Detail & 7-Day Historical Trend Modal */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Title & Location */}
                <Text style={styles.detailTitle}>{selectedItem.commodity}</Text>
                <Text style={styles.detailSubtitle}>
                  📍 {selectedItem.market} Mandi ({selectedItem.district}, {selectedItem.state})
                </Text>

                {/* Main Modal Price Banner */}
                <View style={styles.detailPriceCard}>
                  <Text style={styles.detailPriceLabel}>Official Daily Modal Price</Text>
                  <Text style={styles.detailModalVal}>
                    ₹{Number(selectedItem.modal_price).toLocaleString('en-IN')} / Quintal
                  </Text>

                  <View style={styles.detailRangeRow}>
                    <Text style={styles.detailRangeText}>
                      Min: ₹{Number(selectedItem.min_price).toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.detailRangeText}>|</Text>
                    <Text style={styles.detailRangeText}>
                      Max: ₹{Number(selectedItem.max_price).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <Text style={styles.detailArrivalDate}>
                    Arrival / Data Date: {selectedItem.arrival_date}
                  </Text>
                </View>

                {/* Technical Mandi Specs */}
                <View style={styles.specsCard}>
                  <Text style={styles.specsTitle}>APMC Telemetry Specifications</Text>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>Variety:</Text>
                    <Text style={styles.specVal}>{selectedItem.variety}</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>Grade:</Text>
                    <Text style={styles.specVal}>{selectedItem.grade}</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>Market (Mandi):</Text>
                    <Text style={styles.specVal}>{selectedItem.market}</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>District / State:</Text>
                    <Text style={styles.specVal}>
                      {selectedItem.district}, {selectedItem.state}
                    </Text>
                  </View>
                </View>

                {/* Section 2: 7-Day Historical Daily Price Trend */}
                <View style={styles.trendSection}>
                  <Text style={styles.trendSectionTitle}>7-Day Price Trend</Text>
                  <Text style={styles.trendSectionSubtitle}>
                    Daily Price Trend (Agmarknet Daily Arrival Data)
                  </Text>

                  {loadingTrend ? (
                    <ActivityIndicator size="small" color={Colors.primary} style={styles.trendSpinner} />
                  ) : historicalTrend.length > 0 ? (
                    <View style={styles.trendList}>
                      {historicalTrend.slice(0, 7).map((tRecord, idx) => (
                        <View key={idx} style={styles.trendRow}>
                          <Text style={styles.trendDate}>📅 {tRecord.arrival_date}</Text>
                          <Text style={styles.trendMarket} numberOfLines={1}>
                            {tRecord.market}
                          </Text>
                          <Text style={styles.trendPrice}>
                            ₹{Number(tRecord.modal_price).toLocaleString('en-IN')} / Qtl
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noTrendText}>
                      Historical trend data for this commodity is current with today's arrival of ₹
                      {Number(selectedItem.modal_price).toLocaleString('en-IN')} / Qtl.
                    </Text>
                  )}
                </View>

                {/* Source Attribution */}
                <View style={styles.modalAttribution}>
                  <Text style={styles.attributionText}>
                    Source: Government of India – Agmarknet / data.gov.in
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeDetailBtn}
                  onPress={() => setSelectedItem(null)}>
                  <Text style={styles.closeDetailText}>Close Market Ticker</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
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
  refreshIconBtn: {
    padding: Spacing.xs,
  },
  refreshIcon: {
    fontSize: 18,
  },
  sourceBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  sourceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sourceIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  sourceTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
  },
  sourceSubtitle: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
  },
  searchSpacing: {
    marginBottom: Spacing.md,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: '32%',
  },
  filterLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginRight: 2,
  },
  filterValue: {
    flex: 1,
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  filterArrow: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  loadingBox: {
    paddingVertical: Spacing.xl * 2,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorBox: {
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  errorIcon: {
    fontSize: 42,
    marginBottom: Spacing.xs,
  },
  errorTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.danger,
    marginBottom: 4,
  },
  errorSub: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  retryBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  clearFilterBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearFilterText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  recordCountText: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  recordCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  leftTitleBox: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  commodityName: {
    fontSize: Typography.bodySize + 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  mandiLocation: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rightPriceBox: {
    alignItems: 'flex-end',
  },
  modalPriceValue: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  priceUnitLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  priceBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    padding: Spacing.xs + 2,
    marginVertical: Spacing.xs,
  },
  pricePill: {
    flex: 1,
    alignItems: 'center',
  },
  pricePillHighlight: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 6,
    paddingVertical: 2,
  },
  pricePillLabel: {
    fontSize: Typography.captionSize - 1,
    color: Colors.textMuted,
  },
  pricePillVal: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightSemiBold,
    color: Colors.textPrimary,
  },
  pricePillLabelHighlight: {
    fontSize: Typography.captionSize - 1,
    color: Colors.primary,
    fontWeight: Typography.weightBold,
  },
  pricePillValHighlight: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  gradeText: {
    fontSize: Typography.captionSize - 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weightMedium,
  },
  arrivalDateText: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.lg,
    maxHeight: '70%',
  },
  modalHeaderTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalOptionSelected: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: Spacing.xs,
  },
  modalOptionText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
  },
  modalOptionTextSelected: {
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  checkmarkIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    marginTop: Spacing.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
  },
  modalCloseText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    fontWeight: Typography.weightBold,
  },
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  detailTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  detailSubtitle: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  detailPriceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailPriceLabel: {
    fontSize: Typography.captionSize,
    color: '#A7F3D0',
    fontWeight: Typography.weightMedium,
  },
  detailModalVal: {
    fontSize: 32,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginVertical: 4,
  },
  detailRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  detailRangeText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textLight,
  },
  detailArrivalDate: {
    fontSize: Typography.captionSize,
    color: '#D1D5DB',
    marginTop: 4,
  },
  specsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specsTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  specKey: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textMuted,
  },
  specVal: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightSemiBold,
    color: Colors.textPrimary,
  },
  trendSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  trendSectionTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
  },
  trendSectionSubtitle: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  trendList: {
    marginTop: Spacing.xs,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight + '20',
  },
  trendDate: {
    fontSize: Typography.captionSize,
    color: Colors.textPrimary,
    width: 90,
  },
  trendMarket: {
    flex: 1,
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  trendPrice: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  noTrendText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  modalAttribution: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  attributionText: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  closeDetailBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  closeDetailText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  trendSpinner: {
    marginVertical: 12,
  },
});


export default MarketPricesScreen;