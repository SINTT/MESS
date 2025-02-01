import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Добавлен импорт
import { FIREBASE_AUTH } from './firebaseConfig'; // Обновите импорт



import LogoMess from './assets/logomess.png';

const LoginScreen = () => {
  const navigation = useNavigation();
  const passwordInputRef = useRef(null);
  const [email, setEmail] = useState(''); // Добавлено состояние для email
  const [password, setPassword] = useState(''); // Добавлено состояние для password

  const handleRegistration = () => {
    navigation.navigate('Registration');
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      
      // Получите id пользователя
      const userId = userCredential.user.uid;
      
      // Сохраните id пользователя в глобальное состояние или локальное хранилище
      await AsyncStorage.setItem('userId', userId);
      
      // Если авторизация успешна, перенаправьте пользователя на 'Main'
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login failed', error.message);
      // Обработка ошибок авторизации
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image source={LogoMess} style={styles.logo} />

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            {/* Добавьте обработчики изменения текста для обновления состояния email и password */}
            <TextInput style={styles.input} placeholder="E-mail" returnKeyType="next" onChangeText={setEmail} onSubmitEditing={() => passwordInputRef.current?.focus()} />
            <TextInput ref={passwordInputRef} style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registrationButton} onPress={handleRegistration}>
              <Text style={styles.registrationButtonText}>Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
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
    height: '100%'
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
    marginBottom: 100,
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
    width: 100,
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

export default LoginScreen;
