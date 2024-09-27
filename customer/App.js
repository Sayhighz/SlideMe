import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import TabNavigator from './components/TabNavigator';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
  
  const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );

};

export default gestureHandlerRootHOC(App);
