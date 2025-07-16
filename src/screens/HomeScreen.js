import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { getStepsToday } from '../services/pedometerService';
import { getData, storeData } from '../storage/storageService';
import config from '../constants/config';
import colors from '../constants/colors';

const WORKOUTS_KEY = 'workouts';
const WORKOUT_TYPES = [
  { name: 'Running', icon: '🏃' },
  { name: 'Gym', icon: '🏋️' },
  { name: 'Volleyball', icon: '🏐' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Cycling', icon: '🚴' },
  { name: 'Yoga', icon: '🧘' },
];

const HomeScreen = () => {
  const [steps, setSteps] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    (async () => {
      const stepCount = await getStepsToday();
      setSteps(stepCount);
      const data = await getData(WORKOUTS_KEY);
      setWorkouts(data || []);
    })();
  }, []);

  useEffect(() => {
    let id;
    if (timerActive) {
      id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [timerActive]);

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setTimer(0);
    setTimerActive(true);
  };

  const stopWorkout = async () => {
    setTimerActive(false);
    if (selectedWorkout && timer > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const data = (await getData(WORKOUTS_KEY)) || [];
      const newWorkout = {
        name: selectedWorkout.name,
        icon: selectedWorkout.icon,
        duration: timer,
        date: today,
      };
      const updated = [...data, newWorkout];
      await storeData(WORKOUTS_KEY, updated);
      setWorkouts(updated);
    }
    setSelectedWorkout(null);
    setTimer(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Steps</Text>
      <View style={styles.card}>
        <Text style={styles.steps}>{steps} / {config.stepGoal}</Text>
      </View>
      <Text style={styles.header}>Start a Workout</Text>
      <View style={styles.workoutTypesRow}>
        {WORKOUT_TYPES.map((w) => (
          <TouchableOpacity
            key={w.name}
            style={styles.workoutTypeBtn}
            onPress={() => startWorkout(w)}
            disabled={timerActive}
          >
            <Text style={styles.workoutTypeIcon}>{w.icon}</Text>
            <Text style={styles.workoutTypeText}>{w.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {timerActive && (
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>
            {selectedWorkout.icon} {selectedWorkout.name} - {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
          </Text>
          <Button title="Stop & Save" onPress={stopWorkout} color={colors.primary} />
        </View>
      )}
      <Text style={styles.header}>Workouts</Text>
      {workouts.length === 0 ? (
        <Text style={styles.noWorkouts}>No workouts logged today.</Text>
      ) : (
        <FlatList
          data={workouts.filter(w => w.date === new Date().toISOString().slice(0, 10))}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutName}>
                {item.icon} {item.category ? `${item.category}: ` : ''}{item.name}
              </Text>
              {item.time ? (
                <Text style={styles.workoutDetails}>{item.time} sec</Text>
              ) : item.sets && item.reps ? (
                <Text style={styles.workoutDetails}>{item.sets} sets x {item.reps} reps</Text>
              ) : item.duration ? (
                <Text style={styles.workoutDetails}>{Math.floor(item.duration / 60)}:{('0' + (item.duration % 60)).slice(-2)} min</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  steps: {
    fontSize: 32,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  workoutTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  workoutTypeBtn: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: 90,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  workoutTypeIcon: {
    fontSize: 28,
  },
  workoutTypeText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  timerBox: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  noWorkouts: {
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 10,
  },
  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'column', // Changed to column to stack details
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the start
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  workoutName: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 5, // Added margin for spacing
  },
  workoutDetails: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5, // Added margin for spacing
  },
  workoutTime: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 2,
  },
});

export default HomeScreen;
