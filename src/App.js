import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import SharedPlaylist from './components/SharedPlaylist';

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyB4mmmr5eSM7qD-bfeqK_AI0lu7GOYeSl4",
  authDomain: "shared-playlist-c8f22.firebaseapp.com",
  projectId: "shared-playlist-c8f22",
  storageBucket: "shared-playlist-c8f22.appspot.com",
  messagingSenderId: "1081323027610",
  appId: "1:1081323027610:web:97adc161a5ae7729e37323",
  measurementId: "G-VWLX9F33Q4"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
  }, []);
 
  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
 
  const handleLogout = () => {
    auth.signOut();
  };
 
  return (
    <div>
      {currentUser ? (
        <div>
          <SharedPlaylist currentUser={currentUser} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
      }
      export default App; 
