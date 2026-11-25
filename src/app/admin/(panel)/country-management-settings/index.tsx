import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes } from '@/constants/theme';
import { Card, PageTitle } from '@/components/admin/AdminUI';
import { CONTINENTS } from '@/data';
import { Btn, DataTable, type Column } from '@ichrono/ui';

/** backend_ref/views/admin/country-management-settings/index.blade.php */
type Row = { id: string; continent: string };

export default function CountriesSetting() {
  const rows: Row[] = CONTINENTS.map((c) => ({ id: c, continent: c }));
  const columns: Column<Row>[] = [
    { key: 'sr', title: 'SR No.', width: 100, render: (_r, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'continent', title: 'Continent', width: 260 },
    {
      key: 'action',
      title: 'Action',
      width: 260,
      render: (r) => (
        <Btn
          title="Manage Countries"
          variant="customBtn"
          small
          style={{ alignSelf: 'flex-start', paddingHorizontal: 20 }}
          onPress={() => router.push(`/admin/country-management-settings/${encodeURIComponent(r.continent)}` as any)}
        />
      ),
    },
  ];
  return (
    <View>
      <PageTitle>Countries setting</PageTitle>
      <Card style={{ marginTop: Spacing['2xl'] }}>
        <DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '700' },
});
