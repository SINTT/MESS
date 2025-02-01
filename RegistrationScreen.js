// RegistrationScreen.js
import React, { useState } from 'react';
import LogoMess from './assets/logomess.png';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebaseConfig'; // Update this import based on your file structure

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      // Access the user object from the credential
      const user = userCredential.user;

      // Save the user's nickname in the database
      await setDoc(doc(FIREBASE_DB, 'users', user.uid), {
        nickname,
      });

      // Navigate to the desired screen after successful registration
      navigation.navigate('Login'); // Change 'Home' to the screen you want to navigate to
    } catch (error) {
      console.error('Registration failed', error.message);
      // Handle registration failure here
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={LogoMess} style={styles.logo} />
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={nickname}
              onChangeText={setNickname}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registrationButton}
              onPress={handleLoginNavigation}
            >
              <Text style={styles.registrationButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRegistration}
            >
              <Text style={styles.loginButtonText}>Registration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    width: '100%',
    height: '100%',
  },
  logo: {
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  contentContainer: {
    width: 250,
  },
  inputContainer: {},
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    marginBottom: 145,
  },
  registrationButton: {
    flex: 1,
    marginEnd: 10,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  registrationButtonText: {
    color: '#2F80ED',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
  loginButton: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#2F80ED',
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default RegistrationScreen;
