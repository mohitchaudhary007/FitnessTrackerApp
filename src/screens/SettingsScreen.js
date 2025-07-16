import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, ScrollView } from 'react-native';
import colors from '../constants/colors';

const userIcon = require('../assets/user.png');

const SettingsScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const calculateBMI = () => {
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (h > 0) setBmi((w / (h * h)).toFixed(2));
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Settings</Text>
      {!isLoggedIn ? (
        <View style={styles.authBox}>
          <Image source={userIcon} style={styles.userIcon} />
          <Text style={styles.sectionTitle}>{showRegister ? 'Register' : 'Login'}</Text>
          {showRegister ? (
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.border}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.border}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.border}
          />
          {showRegister ? (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowRegister(!showRegister)}>
            <Text style={styles.link}>{showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileBox}>
          <Image source={userIcon} style={styles.userIconLarge} />
          <Text style={styles.profileName}>{name || 'Your Name'}</Text>
          <Text style={styles.profilePhone}>{phone || 'Phone Number'}</Text>
          <View style={styles.verticalInfoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                onBlur={calculateBMI}
                placeholder="Height"
                placeholderTextColor={colors.border}
              />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                onBlur={calculateBMI}
                placeholder="Weight"
                placeholderTextColor={colors.border}
              />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BMI</Text>
              <Text style={styles.bmiValue}>{bmi || '--'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Diet</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe your diet"
                placeholderTextColor={colors.border}
              />
            </View>
          </View>
          <Text style={styles.sectionTitle}>Other Settings</Text>
          <TouchableOpacity style={styles.settingBtn}><Text style={styles.settingBtnText}>Change Password</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn}><Text style={styles.settingBtnText}>Notification Preferences</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn}><Text style={styles.settingBtnText}>Logout</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, alignItems: 'center', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 24, letterSpacing: 1 },
  authBox: { backgroundColor: colors.card, borderRadius: 18, padding: 28, alignItems: 'center', width: '100%', marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  userIcon: { width: 70, height: 70, marginBottom: 14, borderRadius: 35, resizeMode: 'contain', borderWidth: 2, borderColor: colors.primary },
  userIconLarge: { width: 100, height: 100, marginBottom: 10, borderRadius: 50, resizeMode: 'contain', borderWidth: 2, borderColor: colors.primary },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.secondary, marginVertical: 14 },
  input: { backgroundColor: colors.background, borderRadius: 8, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: colors.border, width: 230, fontSize: 16 },
  link: { color: colors.secondary, marginTop: 12, textDecorationLine: 'underline', fontWeight: 'bold' },
  button: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 12, marginBottom: 4, width: 180, alignItems: 'center', elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  profileBox: { backgroundColor: colors.card, borderRadius: 18, padding: 28, alignItems: 'center', width: '100%', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  profileInfo: { marginLeft: 18 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginTop: 8 },
  profilePhone: { fontSize: 16, color: colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 16 },
  infoBox: { alignItems: 'center', flex: 1, marginHorizontal: 6 },
  infoLabel: { color: colors.text, fontWeight: 'bold', marginBottom: 6, fontSize: 15 },
  bmiValue: { fontSize: 20, color: colors.primary, fontWeight: 'bold', marginTop: 10 },
  settingBtn: { backgroundColor: colors.background, borderRadius: 8, padding: 14, marginVertical: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.border, elevation: 1 },
  settingBtnText: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  verticalInfoBox: { width: '100%', marginVertical: 10 },
  infoRow: { marginBottom: 16, width: '100%' },
});

export default SettingsScreen;
