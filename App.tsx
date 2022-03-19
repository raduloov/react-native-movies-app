import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from './src/firebase/firebase-config';
import AuthStack from './src/navigation/AuthStack';
import AppTabs from './src/navigation/AppTabs';
import { Provider } from 'react-redux';
import store from './src/store';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  onAuthStateChanged(auth, user => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setLoading(false);
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <StatusBar barStyle="default" />
        <NavigationContainer>
          {isLoggedIn ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});

export default App;
