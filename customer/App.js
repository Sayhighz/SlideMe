import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import TabNavigator from './components/TabNavigator';
import Loginpage from './pages/LoginPage/Loginpage';


  
  const App = () => {
  return (
    <NavigationContainer>
      {/* <TabNavigator /> */}
      <Loginpage></Loginpage>
    </NavigationContainer>
  );

};

export default gestureHandlerRootHOC(App);
