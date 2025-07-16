import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList, Image } from 'react-native';
import { storeData, getData } from '../storage/storageService';
import colors from '../constants/colors';

const WORKOUTS_KEY = 'workouts';

const chestIcon = require('../assets/chest.png'); // Chest muscle icon

const GYM_CATEGORIES = [
  {
    name: 'Chest',
    icon: chestIcon,
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Chest Fly', 'Push Ups', 'Cable Crossover'],
  },
  {
    name: 'Back',
    icon: '🏋️‍♂️',
    exercises: ['Pull Ups', 'Deadlift', 'Lat Pulldown', 'Seated Row'],
  },
  {
    name: 'Arms',
    icon: '🦾',
    exercises: ['Bicep Curl', 'Tricep Extension', 'Hammer Curl', 'Dips'],
  },
  {
    name: 'Abdominals',
    icon: '🧘',
    exercises: ['Crunches', 'Plank', 'Leg Raise', 'Russian Twist'],
  },
  {
    name: 'Legs',
    icon: '🦵',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Extension'],
  },
  {
    name: 'Shoulders',
    icon: '🏋️',
    exercises: ['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Shrugs'],
  },
];

const TIME_BASED_EXERCISES = ['Plank', 'Wall Sit'];

const WorkoutScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [time, setTime] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    (async () => {
      const data = await getData(WORKOUTS_KEY);
      setWorkouts(data || []);
    })();
  }, []);

  const isTimeBased = TIME_BASED_EXERCISES.includes(selectedExercise);

  const logWorkout = async () => {
    if (!selectedCategory || !selectedExercise || (isTimeBased ? !time : (!sets || !reps))) {
      setMessage('Please select a category, exercise, and enter the required details.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const startTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const data = (await getData(WORKOUTS_KEY)) || [];
    const newWorkout = {
      name: selectedExercise,
      category: selectedCategory.name,
      icon: selectedCategory.icon,
      date: today,
      startTime,
      ...(isTimeBased
        ? { time: Number(time) }
        : { sets: Number(sets), reps: Number(reps) }),
    };
    const updated = [...data, newWorkout];
    await storeData(WORKOUTS_KEY, updated);
    setWorkouts(updated);
    setSelectedCategory(null);
    setSelectedExercise(null);
    setSets('');
    setReps('');
    setTime('');
    setMessage('Workout logged!');
    setTimeout(() => setMessage(''), 1500);
  };

  // Extract today's workouts
  const todaysWorkouts = workouts.filter(w => w.date === new Date().toISOString().slice(0, 10));

  // Header and form content to be used as FlatList's ListHeaderComponent
  const renderHeader = () => (
    <>
      <Text style={styles.header}>Log a Gym Workout</Text>
      <Text style={styles.label}>Select Category:</Text>
      <View style={styles.catRow}>
        {GYM_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.name}
            style={[styles.catBtn, selectedCategory && selectedCategory.name === cat.name && styles.catBtnActive]}
            onPress={() => {
              setSelectedCategory(cat);
              setSelectedExercise(null);
            }}
            activeOpacity={0.8}
          >
            {cat.icon === chestIcon ? (
              <Image source={cat.icon} style={styles.catIconImg} />
            ) : (
              <Text style={styles.catIcon}>{cat.icon}</Text>
            )}
            <Text style={styles.catBtnText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedCategory && (
        <>
          <Text style={styles.label}>Select Exercise:</Text>
          <View style={styles.exRow}>
            {selectedCategory.exercises.map(ex => (
              <TouchableOpacity
                key={ex}
                style={[styles.exBtn, selectedExercise === ex && styles.exBtnActive]}
                onPress={() => setSelectedExercise(ex)}
                activeOpacity={0.8}
              >
                <Text style={styles.exBtnText}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {selectedExercise && (
        <>
          {isTimeBased ? (
            <>
              <Text style={styles.label}>Time (seconds):</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                keyboardType="numeric"
                placeholder="e.g. 60"
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Sets:</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
                placeholder="e.g. 3"
              />
              <Text style={styles.label}>Reps:</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                placeholder="e.g. 12"
              />
            </>
          )}
          <Button title="Log Workout" onPress={logWorkout} color={colors.primary} />
        </>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Text style={styles.header}>Today's Workouts</Text>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        data={todaysWorkouts}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.workoutCard}>
            {item.icon === chestIcon ? (
              <Image source={chestIcon} style={styles.catIconImgSmall} />
            ) : (
              <Text style={styles.catIconSmall}>{item.icon}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.workoutName}>{item.category}: {item.name}</Text>
              {item.time ? (
                <Text style={styles.workoutDetails}>{item.time} sec</Text>
              ) : item.duration ? (
                <Text style={styles.workoutDetails}>{Math.round(item.duration)} sec</Text>
              ) : (
                <Text style={styles.workoutDetails}>{item.sets} sets x {item.reps} reps</Text>
              )}
            </View>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.noWorkouts}>No workouts logged today.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 12, marginTop: 16 },
  label: { color: colors.text, marginTop: 10, marginBottom: 4, fontWeight: 'bold' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'space-between' },
  catBtn: { backgroundColor: colors.card, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 10, margin: 6, borderWidth: 1, borderColor: colors.border, alignItems: 'center', width: 110, elevation: 2 },
  catBtnActive: { backgroundColor: colors.primary, borderColor: colors.secondary },
  catIcon: { fontSize: 32, marginBottom: 6 },
  catIconImg: { width: 36, height: 36, marginBottom: 6, resizeMode: 'contain' },
  catBtnText: { color: colors.text, fontWeight: 'bold', fontSize: 15, marginTop: 2, textAlign: 'center' },
  exRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'space-between' },
  exBtn: { backgroundColor: colors.card, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, margin: 6, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  exBtnActive: { backgroundColor: colors.secondary, borderColor: colors.primary },
  exBtnText: { color: colors.text, fontWeight: 'normal', fontSize: 15, textAlign: 'center' },
  input: { backgroundColor: colors.card, borderRadius: 8, padding: 8, marginVertical: 8, borderWidth: 1, borderColor: colors.border, width: 100 },
  message: { color: colors.primary, marginVertical: 8, fontWeight: 'bold' },
  workoutCard: { backgroundColor: colors.card, borderRadius: 8, padding: 12, marginVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10, elevation: 1 },
  catIconSmall: { fontSize: 24, marginRight: 8 },
  catIconImgSmall: { width: 24, height: 24, marginRight: 8, resizeMode: 'contain' },
  workoutName: { fontSize: 16, color: colors.primary, fontWeight: 'bold', flex: 1 },
  workoutDetails: { fontSize: 15, color: colors.text, marginLeft: 8 },
  workoutTime: { fontSize: 13, color: colors.secondary, marginTop: 2 },
  noWorkouts: { color: colors.text, fontStyle: 'italic', marginTop: 10 },
});

export default WorkoutScreen;
