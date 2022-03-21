import { signOut } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db, storage } from '../firebase/firebase-config';
import Icon from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = auth;
  const { favorites } = useSelector((state: any) => state.api);

  useEffect(() => {
    const getUserInfo = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser?.uid);
          const userSnap = (await getDoc(userRef)).data();
          const user = userSnap;

          const imageRef = ref(storage, `images/${currentUser.uid}`);
          const imageUrl = await getDownloadURL(imageRef);

          setUserInfo(user);
          setImage(imageUrl);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    getUserInfo();
    setLoading(false);
  }, []);

  const logoutHandler = async () => {
    await signOut(auth);
  };

  const selectImageHandler = () => {
    launchImageLibrary(
      {
        mediaType: 'photo'
      },
      ({ assets }) => {
        if (assets && assets.length > 0) {
          setImage(assets[0].uri);
        }
      }
    ).catch(error => console.log(error));
  };

  const uploadImageHandler = async () => {
    try {
      if (image && currentUser) {
        setLoading(true);
        const imageRef = ref(storage, `images/${currentUser.uid}`);
        const img = await fetch(image);
        const bytes = await img.blob();

        uploadBytes(imageRef, bytes).then(snapshot => {
          Alert.alert('Image updated successfully!');
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
          {userInfo.displayName}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          paddingBottom: 200
        }}
      >
        <View>
          <View style={styles.profileImageContainer}>
            {loading && (
              <View style={styles.imageLoading}>
                <ActivityIndicator size="large" />
              </View>
            )}
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ height: '100%', width: '100%', borderRadius: 10 }}
              />
            ) : (
              <Icon name="user" size={200} />
            )}
          </View>
          <TouchableOpacity onPress={selectImageHandler}>
            <Button>Edit Image</Button>
          </TouchableOpacity>
          <View
            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
          >
            <Text style={{ fontSize: 20 }}>
              Your favorite movies: {favorites.length}
            </Text>
          </View>
        </View>
        <View>
          <Button onPress={uploadImageHandler}>Save</Button>
          <Button onPress={logoutHandler}>Logout</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    borderBottomWidth: 1,
    marginBottom: 20
  },
  profileImageContainer: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6'
  },
  imageLoading: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileScreen;
