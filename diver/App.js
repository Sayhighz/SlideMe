// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

// Import screens and components
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/History/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobsScreen from './screens/Job/JobsScreen';
import JobDetail from './screens/Job/JobDetail';
import JobWorking_Pickup_Screen from './screens/Job/JobWorking_Pickup_Screen';
import JobWorking_Dropoff_Screen from './screens/Job/JobWorking_Dropoff_Screen';
import NotificationRequest from './screens/NotificationRequest'; // Import the component
import CarUploadPickUpConfirmation from './screens/Job/CarUploadPickUpConfirmation';
import CarUploadDropOffConfirmation from './screens/Job/CarUploadDropOffConfirmation';
import HomeLogin from './screens/LoginDriver/HomeLogin';
import FirstRegister from './screens/LoginDriver/FirstRegister';
import SecondRegister from './screens/LoginDriver/SecondRegister';
import ThirdRegister from './screens/LoginDriver/ThirdRegister';
import FourthRegister from './screens/LoginDriver/FourthRegister';
import FifthRegister from './screens/LoginDriver/FifthRegister';
import SixRegister from './screens/LoginDriver/SixRegister';

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
      <Stack.Screen name="SecondRegister" component={SecondRegister} />
      <Stack.Screen name="ThirdRegister" component={ThirdRegister} />
      <Stack.Screen name="FourthRegister" component={FourthRegister} />
      <Stack.Screen name="FifthRegister" component={FifthRegister} />
      <Stack.Screen name="SixRegister" component={SixRegister} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // เก็บข้อมูลผู้ใช้

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

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user); // เก็บข้อมูลผู้ใช้เมื่อเข้าสู่ระบบสำเร็จ
};

  const driver_id = 2; // Assume this is retrieved when the user logs in or from context/state

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <AuthNavigator handleLogin={handleLogin} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
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

        {/* Render NotificationRequest component */}
        <NotificationRequest driver_id={driver_id} />
      </View>
    </NavigationContainer>
  );
}
