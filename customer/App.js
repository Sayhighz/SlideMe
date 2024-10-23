import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import TabNavigator from './components/TabNavigator';


  
  const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

};

export default gestureHandlerRootHOC(App);
