import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import { auth } from '../firebase/firebase-config';
import { AuthStackNavProps } from '../types/AuthParamList';

const LoginScreen = ({ navigation }: AuthStackNavProps<'Login'>) => {
  const [enteredEmail, setEnteredEmail] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async () => {
    if (error !== '') {
      setError('');
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      // setLoading(false);
    } catch (error: any) {
      if (error.code.includes('auth/invalid-email')) {
        setError('Invalid email.');
      } else if (error.code.includes('auth/wrong-password')) {
        setError('Password for this user is invalid.');
      } else {
        setError('Unable to login. Please try again later.');
      }

      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={showError} onDismiss={() => setShowError(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{error}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowError(false)}>Okay</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.textContainer}>
        <Text style={{ fontSize: 35 }}>Welcome to</Text>
        <Text style={styles.text}>Movies App</Text>
      </View>
      <View style={styles.loginForm}>
        <View style={{ height: 150 }}>
          <TextInput
            label="Email"
            mode="outlined"
            onChangeText={text => setEnteredEmail(text)}
            value={enteredEmail}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            onChangeText={text => setEnteredPassword(text)}
            value={enteredPassword}
          />
        </View>
        <Button loading={loading} onPress={login} mode="contained">
          <Text style={styles.buttonText}>Log In</Text>
        </Button>
        <View style={styles.createTextContainer}>
          <Text style={{ fontSize: 16 }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.createButton}>Create one!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    marginTop: 120,
    marginBottom: 50
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginForm: {
    width: '90%'
  },
  createTextContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  createButton: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default LoginScreen;
