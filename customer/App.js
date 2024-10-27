import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import  {createStackNavigator} from '@react-navigation/stack';
import Home from './pages/homePage/Home';
import Map from './pages/map/Map';
import Order from './pages/detailOrder/Order';
import Loginpage from './pages/LoginPage/Loginpage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack(){
  return(
    
    <Stack.Navigator>
      <Stack.Screen name="LoginPage" component={Loginpage}/>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Map" component={Map}/>
      <Stack.Screen name="Order" component={Order} options={{headerShown: false}}/>
      </Stack.Navigator>
  )
}


  const App = () => {
  return (
    <NavigationContainer>
      {/* <TabNavigator /> */}
      <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} options={{headerShown: false}}/>
      <Tab.Screen name="Map" component={Map} options={{headerShown: false}}/>
      </Tab.Navigator>
      
    </NavigationContainer>
  );

};

export default gestureHandlerRootHOC(App);
