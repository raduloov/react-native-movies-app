import { signOut } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '../firebase/firebase-config';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  const { currentUser } = auth;

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser?.uid);
        const userSnap = (await getDoc(userRef)).data();
        const user = userSnap;

        setUserInfo(user);
        // dispatch(apiActions.setFavorites(favs));
      }
    };

    getUserInfo();
  }, []);

  console.log(userInfo);

  const logoutHandler = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
          {userInfo.displayName}
        </Text>
      </View>
      <View>
        <Button onPress={logoutHandler}>Logout</Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    borderBottomWidth: 1
  }
});

export default ProfileScreen;
