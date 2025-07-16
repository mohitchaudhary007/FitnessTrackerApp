import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { configureNotifications } from './services/notificationService';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  useEffect(() => {
    configureNotifications();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
};

export default App;