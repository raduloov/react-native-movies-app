import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import { auth, db } from '../firebase/firebase-config';
import { AuthStackNavProps } from '../types/AuthParamList';
import { setDoc, doc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }: AuthStackNavProps<'SignUp'>) => {
  const [enteredEmail, setEnteredEmail] = useState<string>('');
  const [enteredName, setEnteredName] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async () => {
    if (error !== '') {
      setError('');
    }

    if (enteredPassword !== confirmPassword) {
      setError('Please make sure your passwords match.');
      setShowError(true);
      return;
    }

    if (enteredName.trim().length === 0) {
      setError('Please enter your name.');
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );

      await setDoc(doc(db, 'users', newUser.user.uid), {
        email: enteredEmail,
        displayName: enteredName,
        favorites: []
      });

      setLoading(false);
    } catch (error: any) {
      if (error.code.includes('auth/weak-password')) {
        setError('Password must be at least 6 characters long.');
      } else if (error.code.includes('auth/email-already-in-use')) {
        setError('Email is already in use.');
      } else {
        setError('Unable to register. Please try again later.');
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
        <Text style={{ fontSize: 35 }}>Create a</Text>
        <Text style={styles.text}>Movies App</Text>
        <Text style={{ fontSize: 35 }}>account</Text>
      </View>
      <View style={styles.loginForm}>
        <View style={{ height: 270 }}>
          <TextInput
            label="Email"
            mode="outlined"
            onChangeText={text => setEnteredEmail(text)}
            value={enteredEmail}
          />
          <TextInput
            label="Full Name"
            mode="outlined"
            onChangeText={text => setEnteredName(text)}
            value={enteredName}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            onChangeText={text => setEnteredPassword(text)}
            value={enteredPassword}
          />
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            onChangeText={text => setConfirmPassword(text)}
            value={confirmPassword}
          />
        </View>
        <Button loading={loading} onPress={signUp} mode="contained">
          <Text style={styles.buttonText}>Sign Up</Text>
        </Button>
        <View style={styles.createTextContainer}>
          <Text style={{ fontSize: 16 }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.createButton}>Log In!</Text>
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

export default SignUpScreen;
