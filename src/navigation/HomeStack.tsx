import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExploreScreen from '../screens/ExploreScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen
        name="Details"
        // options={({ route }) => ({ title: route.params.name })}
        component={MovieDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
