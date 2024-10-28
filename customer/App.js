// File path: /mnt/data/App.js

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './pages/homePage/Home';
import Map from './pages/map/Map';
import Order from './pages/detailOrder/Order';
import Loginpage from './pages/LoginPage/Loginpage';
import HistoryPage from './pages/historyPage/History';
import PaymentMethodsListScreen from './pages/PaymentMethod/PaymentMethodsListScreen';
import AddPaymentMethod from './pages/PaymentMethod/AddPaymentMethod';
import MessageBoxScreen from './pages/MessageBoxScreen/MessageBoxScreen';
import UserProfile from './pages/userProfile/userProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function PaymentMethodsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentMethodsList"
        component={PaymentMethodsListScreen}
        options={{ title: 'วิธีการชำระเงิน' }}
      />
      <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethod}
        options={{ title: 'เพิ่มวิธีการชำระเงิน' }}
      />
    </Stack.Navigator>
  );
}

function UserProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'โปรไฟล์ผู้ใช้' }} />
      <Stack.Screen name="PaymentMethodsStack" component={PaymentMethodsStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Map':
                  iconName = 'map';
                  break;
                case 'ประวัติการใช้บริการ':
                  iconName = 'history';
                  break;
                case 'การแจ้งเตือน':
                  iconName = 'bell';
                  break;
                case 'โปรไฟล์ผู้ใช้':
                  iconName = 'account';
                  break;
                default:
                  iconName = 'circle';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#60B876',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
          <Tab.Screen name="Map" component={Map} options={{ headerShown: false }} />
          <Tab.Screen name="ประวัติการใช้บริการ" component={HistoryPage} options={{ title: 'ประวัติการใช้บริการ' }}/>
          <Tab.Screen name="การแจ้งเตือน" component={MessageBoxScreen} options={{ title: 'การแจ้งเตือน' }}/>
          <Tab.Screen name="โปรไฟล์ผู้ใช้" component={UserProfileStack} options={{ headerShown: false }} />
        </Tab.Navigator>
      ) : (
        <Loginpage onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
};

export default gestureHandlerRootHOC(App);
