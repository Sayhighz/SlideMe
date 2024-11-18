// File path: /mnt/data/App.js

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator , View } from 'react-native';
import { useFonts } from 'expo-font';


import { BorderlessButton, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './pages/homePage/Home';
import MapDetail from './pages/Mapdetail/Mapdetail';
import Order from './pages/detailOrder/Order';
import Loginpage from './pages/LoginPage/Loginpage';
import HistoryPage from './pages/historyPage/History';
import PaymentMethodsListScreen from './pages/PaymentMethod/PaymentMethodsListScreen';
import AddPaymentMethod from './pages/PaymentMethod/AddPaymentMethod';
import MessageBoxScreen from './pages/MessageBoxScreen/MessageBoxScreen';
import UserProfile from './pages/userProfile/userProfile';
import MapPage from './pages/MapPage/MapPage';
import PaymentPage from './pages/paymentPage/PaymentPage';
import ViewOrder from './pages/viewOrder/ViewOrder';
import Rating from './pages/Rating/rating';
import tw from 'twrnc';




import PhoneVerify from './pages/PhoneVerify/PhoneVerify';
import InfoCustomer from './pages/InfoCustomer/InfoCustomer';
import EditProfile from './pages/editProfile/editProfile';
import AddressPage from './pages/addressPage/addressPage';
import ChooseOffer from './pages/chooseOffer/ChooseOffer';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



function HomeStack() {
  return (
   
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#60B876' }, headerTintColor: 'black' , borderBottomWidth: 0 , shadowOpacity: 0}}>
      <Stack.Screen name="HomePage" component={Home} />
      <Stack.Screen name="Mapdetail" component={MapDetail} />
      <Stack.Screen name="MapPage" component={MapPage} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="ChooseOffer" component={ChooseOffer} />
      <Stack.Screen name="payment" component={PaymentPage} />
      <Stack.Screen name="viewOrder" component={ViewOrder} />
      <Stack.Screen name="Rating" component={Rating} />
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
      <Stack.Screen name="userHistoryPage" component={HistoryPage} options={{ title: 'ประวัติการใช้บริการ' }} />
      <Stack.Screen name="editProfile" component={EditProfile} options={{ title: 'แก้ไขข้อมูลผู้ใช้' }} />
      <Stack.Screen name="addressPage" component={AddressPage} options={{ title: 'แก้ไขข้อมูลที่อยู่' }} />
    </Stack.Navigator>
  );
}



function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Loginpage} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneVerify" options={{ headerShown: false }} >
      {() => <PhoneVerify onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="InfoCustomer" options={{ headerShown: false }}>
        {() => <InfoCustomer onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fontsLoaded] = useFonts({
    'Mitr-Regular': require('./assets/fonts/Mitr-Regular.ttf'), // Ensure you have the font file
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
                      tabBarInactiveTintColor: '#555D65',
                    })}
                    >
                      
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
          
          <Tab.Screen name="ประวัติการใช้บริการ" component={HistoryPage} options={{ title: 'ประวัติการใช้บริการ' }} />
          <Tab.Screen name="การแจ้งเตือน" component={MessageBoxScreen} options={{ title: 'การแจ้งเตือน' }} />
          
          {/* <Tab.Screen name="Map" component={Map} options={{ headerShown: false }} /> */}
          <Tab.Screen name="โปรไฟล์ผู้ใช้" component={UserProfileStack} options={{ headerShown: false }} />
          
        </Tab.Navigator>
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
      
    </NavigationContainer>
  );
};

export default gestureHandlerRootHOC(App);
