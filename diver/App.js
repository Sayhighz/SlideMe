// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {useFonts } from 'expo-font';
import { ActivityIndicator , View } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/History/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobsScreen from './screens/Job/JobsScreen';
import JobDetail from './screens/Job/JobDetail';
import JobWorking_Pickup_Screen from './screens/JobWorking_Pickup_Screen';
import JobWorking_Dropoff_Screen from './screens/JobWorking_Dropoff_Screen';
import NotificationRequest from './screens/NotificationRequest';
import CarUploadPickUpConfirmation from './screens/Job/CarUploadPickUpConfirmation';
import CarUploadDropOffConfirmation from './screens/Job/CarUploadDropOffConfirmation';
import HomeLogin from './screens/LoginDriver/HomeLogin';
import FirstRegister from './screens/LoginDriver/FirstRegister';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="JobsScreen" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="JobWorking_Pickup" component={JobWorking_Pickup_Screen} />
      <Stack.Screen name="CarUploadPickUpConfirmation" component={CarUploadPickUpConfirmation} />
      <Stack.Screen name="JobWorking_Dropoff" component={JobWorking_Dropoff_Screen} />
      <Stack.Screen name="CarUploadDropOffConfirmation" component={CarUploadDropOffConfirmation} />
    </Stack.Navigator>
  );
}

function AuthNavigator({ handleLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeLogin">
        {(props) => <HomeLogin {...props} onLogin={handleLogin} />}
      </Stack.Screen>
      <Stack.Screen name="FirstRegister" component={FirstRegister} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fontsLoaded] = useFonts({
    'Mitr-Regular': require('./assets/fonts/Mitr-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <ActivityIndicator size="large" color="#60B876" />
      </View>
    );
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <AuthNavigator handleLogin={handleLogin} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: tw`bg-gray-800`,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeTab') {
              iconName = 'home';
            } else if (route.name === 'History') {
              iconName = 'history';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#60B876',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ title: 'หน้าหลัก' }}
        />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'ประวัติการทำงาน' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
