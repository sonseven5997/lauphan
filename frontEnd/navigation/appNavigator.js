import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen/mainScreen';
import DetailScreen from '../screens/DetailScreen/detailScreen';

const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="mainscreen" component={MainScreen} />
        <Stack.Screen name="detailscreen" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
