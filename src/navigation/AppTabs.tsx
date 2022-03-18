import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import HomeScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import HomeStack from './HomeStack';

const Tabs = createMaterialBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Popular"
      activeColor="#fff"
      inactiveColor="#000"
      shifting
    >
      <Tabs.Screen
        name="Explore"
        component={HomeStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarColor: '#f59e42',
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="explore" color={color} size={20} />
          )
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={HomeStack}
        options={{
          tabBarLabel: 'Favorites',
          tabBarColor: 'red',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="heart" color={color} size={20} />
          )
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: 'gray',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="user" color={color} size={20} />
          )
        }}
      />
    </Tabs.Navigator>
  );
};

export default AppTabs;
