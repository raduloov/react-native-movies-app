import { signOut } from '@firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { auth } from '../firebase/firebase-config';

const ProfileScreen = () => {
  const logoutHandler = async () => {
    await signOut(auth);
  };
  return (
    <SafeAreaView>
      <View>
        <Button onPress={logoutHandler}>Logout</Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;
