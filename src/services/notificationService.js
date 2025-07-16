import * as Notifications from 'expo-notifications';

export const configureNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications not granted!');
  }
};

export const scheduleNotification = async (content, trigger) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title || 'Reminder',
      body: content.body || 'Time to hydrate! Drink a glass of water 💧',
    },
    trigger: trigger || { seconds: 60, repeats: false },
  });
};
