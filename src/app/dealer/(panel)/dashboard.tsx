import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { NEW_ORDERS } from '@/data';
import { useBreakpoint, Icon } from '@ichrono/ui';

/** backend_ref/views/dealer/dashboard.blade.php */
export default function DealerDashboard() {
  const { mdUp, lgUp } = useBreakpoint();
  const half = mdUp ? '48.5%' : '100%';
  const orderBasis = lgUp ? '31.5%' : mdUp ? '48%' : '100%';

  return (
    <View>
      <Text style={styles.pageTitle}>Dashboard</Text>

      <View style={styles.row}>
        {/* Total Revenue */}
        <View style={[styles.card, { flexBasis: half, flexGrow: 1 }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.revenueRow}>
                <Icon name="dollar-sign" size={22} color={Palette.primary} />
                <Text style={styles.revenue}>1,20,2000</Text>
              </View>
              <Text style={styles.h3}>Total Revenue</Text>
              <Text style={styles.asOf}>As of now</Text>
            </View>
            <View style={styles.iconBubble}>
              <Icon name="sack-dollar" size={24} color={Palette.secondary} />
            </View>
          </View>
          <Stats
            items={[
              ['Total Products', '136'],
              ['Total Sales', '136'],
              ['Total Orders', '136'],
            ]}
          />
        </View>

        {/* Order Stats */}
        <View style={[styles.card, { flexBasis: half, flexGrow: 1 }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.h3}>Order Stats</Text>
            </View>
            <View style={styles.iconBubble}>
              <Icon name="cart-shopping" size={22} color={Palette.secondary} />
            </View>
          </View>
          <Stats
            items={[
              ['Ongoing', '136'],
              ['Completed', '136'],
              ['Canceled', '36'],
            ]}
          />
        </View>
      </View>

      <Text style={styles.newHeading}>New Orders</Text>
      <View style={styles.row}>
        {NEW_ORDERS.map((o) => (
          <View key={o.id} style={[styles.order, { flexBasis: orderBasis, flexGrow: mdUp ? 0 : 1 }]}>
            <View style={styles.figure}>
              <Image source={o.image} style={styles.orderImg} resizeMode="cover" />
            </View>
            <View style={styles.orderFlex}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderName}>{o.name}</Text>
                <Text style={styles.orderId}>Order Id:{o.orderId}</Text>
              </View>
              <Text style={styles.amount}>${o.amount}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Stats({ items }: { items: [string, string][] }) {
  return (
    <View style={styles.stats}>
      {items.map(([label, value], i) => (
        <View key={label} style={[styles.stat, i < items.length - 1 && styles.bLine]}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: Palette.primary, fontSize: 26, fontWeight: FontWeights.semibold, marginBottom: Spacing['2xl'] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl },
  card: {
    backgroundColor: Palette.white,
    borderRadius: 10,
    padding: Spacing.xl,
    shadowColor: Palette.primary,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  revenueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  revenue: { color: Palette.primary, fontSize: 26, fontWeight: FontWeights.bold },
  h3: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, marginTop: 4 },
  asOf: { color: Palette.textSecondary, fontSize: FontSizes.sm, marginTop: 2 },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: { flexDirection: 'row', paddingTop: Spacing.lg },
  stat: { flex: 1, alignItems: 'center' },
  bLine: { borderRightWidth: 1, borderRightColor: Palette.divider },
  statLabel: { color: Palette.textSecondary, fontSize: FontSizes.sm, marginBottom: 6, textAlign: 'center' },
  statValue: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
  newHeading: {
    color: Palette.primary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing['3xl'],
    marginBottom: Spacing.lg,
  },
  order: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Palette.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
  },
  figure: { height: 200, backgroundColor: Palette.surfaceMuted },
  orderImg: { width: '100%', height: '100%' },
  orderFlex: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: 8 },
  orderName: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  orderId: { color: Palette.textSecondary, fontSize: FontSizes.xs, marginTop: 2 },
  amount: { color: Palette.secondary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
});
