// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

// นำเข้าหน้าแต่ละหน้า
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/History/HistoryScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobsScreen from './screens/Job/JobsScreen';
import JobDetail from './screens/Job/JobDetail';
import JobWorkingScreen from './screens/JobWorkingScreen'; // เพิ่มการนำเข้า JobWorkingScreen
import NotificationRequest from './screens/NotificationRequest';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// สร้าง HomeStackNavigator สำหรับหน้า Home และ Jobs
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="JobsScreen" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="JobWorking" component={JobWorkingScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/* <NotificationRequest /> */}
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
            } else if (route.name === 'Wallet') {
              iconName = 'wallet';
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
        <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'การเงิน' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
