import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { storeData, getData } from '../storage/storageService';
import config from '../constants/config';
import colors from '../constants/colors';

const WATER_KEY = 'waterIntake';

const WaterIntakeScreen = () => {
  const [glasses, setGlasses] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const data = await getData(WATER_KEY);
      if (data && data.date === today) {
        setGlasses(data.count);
      } else {
        setGlasses(0);
      }
    })();
  }, []);

  const addGlass = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const newCount = glasses + 1;
    setGlasses(newCount);
    setAnimKey(animKey + 1); // trigger animation
    await storeData(WATER_KEY, { date: today, count: newCount });
  };

  return (
    <View style={styles.container}>
      <Animatable.Text
        key={animKey}
        animation="bounceIn"
        style={styles.counter}
      >
        {glasses} / {config.waterGoal} glasses
      </Animatable.Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(glasses / config.waterGoal) * 100}%` }]} />
      </View>
      <Button title="Add a glass" onPress={addGlass} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  counter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  progressBarBg: {
    width: 200,
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 20,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
});

export default WaterIntakeScreen;
