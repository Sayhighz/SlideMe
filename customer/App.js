import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import TabNavigator from './components/TabNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import RecommendedStore from './pages/recommendedStorePage/RecommendedStore';

const Stack = createStackNavigator();
  
  const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="RecommendedStore" component={RecommendedStore} />
      </Stack.Navigator>
    </NavigationContainer>
  );

};

export default gestureHandlerRootHOC(App);
