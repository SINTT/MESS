import React from 'react';
import { View, Image, TouchableOpacity, Text, Animated } from 'react-native';
import logOut from './assets/log-out.png';
import contacts from './assets/contacts.png';
import settings from './assets/settings.png';
import MessagesIco from './assets/Messages-ico.png';
import MessagesIcoBlue from './assets/Messages-ico-blue.png';

const ButtonContainer = ({ handleLogout}) => {

  return (
    <View style={{ height: 58, backgroundColor: "red" }}>
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: "space-evenly", backgroundColor: "white" }}>

      <TouchableOpacity>
          <View style={{ alignItems: 'center', width: 55, height: 55 }}>
            <Image
              source={contacts}
              style={{ width: 32, height: 32 }}
            />
            <Text style={{ fontSize: 12 }}>Contacts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={{ alignItems: 'center', width: 55, height: 55 }}>
            <Animated.Image source={MessagesIcoBlue} style={{ width: 32, height: 32 }} />
            <Text style={{ fontSize: 12, color: '#2F80ED' }}>Messages</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <View style={{ alignItems: 'center', width: 55, height: 55 }}>
            <Image
              source={logOut}
              style={{ width: 32, height: 32 }}
            />
            <Text style={{ fontSize: 12 }}>Exit</Text>
          </View>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default ButtonContainer;
