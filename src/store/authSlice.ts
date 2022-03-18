import { onAuthStateChanged } from '@firebase/auth';
import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../firebase/firebase-config';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    checkForUser: state => {
      onAuthStateChanged(auth, user => {
        if (user) {
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
        }
      });
    }
  }
});

export const authActions = authSlice.actions;

export default authSlice;
