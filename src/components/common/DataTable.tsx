import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import SelectField from './SelectField';

/**
 * React version of the jQuery DataTables tables used across the admin panel
 * (#brandmgt, #watchmgt, #deelermgt): "Show N entries", search box, sortable-looking
 * header, horizontal scroll for wide tables and Previous / page / Next paging.
 */
export type Column<T> = {
  key: string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
  /** value used for searching; defaults to row[key] */
  searchValue?: (row: T) => string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, i: number) => string;
  pageSizeOptions?: number[];
  emptyText?: string;
};

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  pageSizeOptions = [10, 25, 50, 100],
  emptyText = 'No data available in table',
}: Props<T>) {
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        const v = c.searchValue ? c.searchValue(row) : row[c.key];
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [data, query, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const tableWidth = columns.reduce((s, c) => s + (c.width ?? 140), 0);

  return (
    <View>
      <View style={styles.toolbar}>
        <View style={styles.lengthRow}>
          <Text style={styles.toolText}>Show</Text>
          <SelectField
            compact
            height={34}
            value={String(pageSize)}
            onChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
            options={pageSizeOptions.map(String)}
            style={{ width: 76 }}
          />
          <Text style={styles.toolText}>entries</Text>
        </View>
        <View style={styles.searchRow}>
          <Text style={styles.toolText}>Search:</Text>
          <TextInput
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setPage(1);
            }}
            placeholder="Search..."
            placeholderTextColor={Palette.loginBack}
            style={[styles.search, { outlineStyle: 'none' } as any]}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ minWidth: tableWidth, flexGrow: 1 }}>
          <View style={[styles.tr, styles.thead]}>
            {columns.map((c) => (
              <View key={c.key} style={[styles.cell, { width: c.width ?? 140, flexGrow: 1 }]}>
                <Text style={[styles.th, { textAlign: c.align ?? 'left' }]}>{c.title}</Text>
              </View>
            ))}
          </View>
          {rows.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.td}>{emptyText}</Text>
            </View>
          ) : (
            rows.map((row, i) => (
              <View key={keyExtractor(row, start + i)} style={[styles.tr, i % 2 === 0 && styles.odd]}>
                {columns.map((c) => (
                  <View
                    key={c.key}
                    style={[
                      styles.cell,
                      { width: c.width ?? 140, flexGrow: 1 },
                      c.align === 'center' && { alignItems: 'center' },
                      c.align === 'right' && { alignItems: 'flex-end' },
                    ]}
                  >
                    {c.render ? (
                      c.render(row, start + i)
                    ) : (
                      <Text style={[styles.td, { textAlign: c.align ?? 'left' }]}>
                        {String(row[c.key] ?? '')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.info}>
          Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + pageSize, filtered.length)} of{' '}
          {filtered.length} entries
          {query ? ` (filtered from ${data.length} total entries)` : ''}
        </Text>
        <View style={styles.pager}>
          <PageBtn label="Previous" disabled={safePage === 1} onPress={() => setPage(safePage - 1)} />
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => totalPages <= 7 || Math.abs(p - safePage) <= 2 || p === 1 || p === totalPages)
            .map((p) => (
              <PageBtn key={p} label={String(p)} active={p === safePage} onPress={() => setPage(p)} />
            ))}
          <PageBtn label="Next" disabled={safePage === totalPages} onPress={() => setPage(safePage + 1)} />
        </View>
      </View>
    </View>
  );
}

function PageBtn({
  label,
  onPress,
  active,
  disabled,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.pageBtn, active && styles.pageBtnActive, disabled && { opacity: 0.45 }]}
    >
      <Text style={[styles.pageText, active && { color: Palette.white }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  lengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolText: { color: Palette.textBody, fontSize: FontSizes.sm },
  search: {
    height: 36,
    minWidth: 200,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: Palette.textBody,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
    alignItems: 'center',
  },
  thead: {
    backgroundColor: Palette.primary,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    borderBottomWidth: 0,
  },
  odd: { backgroundColor: '#F7FAFB' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, justifyContent: 'center' },
  th: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  empty: { padding: Spacing.xl, alignItems: 'center' },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.lg,
  },
  info: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  pager: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  pageBtn: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  pageBtnActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  pageText: { color: Palette.textBody, fontSize: FontSizes.sm },
});
