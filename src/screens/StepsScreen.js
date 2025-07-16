import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const today = new Date();
const getDayLabel = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

const generateWeekData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    data.push({
      label: getDayLabel(d),
      steps: Math.floor(Math.random() * 8000 + 2000),
    });
  }
  return data;
};

const generateMonthData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    data.push({
      label: getDayLabel(d),
      steps: Math.floor(Math.random() * 8000 + 2000),
    });
  }
  return data;
};

const StepsScreen = () => {
  const [view, setView] = useState('week');
  const weekData = generateWeekData();
  const monthData = generateMonthData();

  const data = view === 'week' ? weekData : monthData.slice(-7); // show last 7 days for month view

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step Count ({view === 'week' ? 'This Week' : 'Last 7 Days'})</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setView('week')} style={[styles.toggleBtn, view === 'week' && styles.activeBtn]}>
          <Text style={styles.toggleText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView('month')} style={[styles.toggleBtn, view === 'month' && styles.activeBtn]}>
          <Text style={styles.toggleText}>Month</Text>
        </TouchableOpacity>
      </View>
      {data.map((d, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.label}>{d.label}</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.min(d.steps / 100, 100)}%` }]} />
          </View>
          <Text style={styles.steps}>{d.steps}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 16 },
  toggleRow: { flexDirection: 'row', marginBottom: 16 },
  toggleBtn: { padding: 8, marginRight: 8, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  activeBtn: { backgroundColor: colors.primary },
  toggleText: { color: colors.text, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { width: 60, color: colors.text },
  barBg: { flex: 1, height: 16, backgroundColor: colors.border, borderRadius: 8, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: 16, backgroundColor: colors.secondary, borderRadius: 8 },
  steps: { width: 60, textAlign: 'right', color: colors.text },
});

export default StepsScreen;
