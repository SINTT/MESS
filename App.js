import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import Main from './Main/Main';
import ChatScreen from './Chat/ChatScreen';
import ContactsSCreen from './Contacts/ContactsSCreen';



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ContactsSCreen" component={ContactsSCreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
