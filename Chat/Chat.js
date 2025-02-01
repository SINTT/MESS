import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

import ava from '../assets/ava.jpeg';
import back from '../assets/back.png';

const Chat = () => {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      {/* Верхний контейнер */}
      <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8 }}>
        <View style={{ alignItems: 'flex-start' }}>
          <TouchableOpacity>
            <Image
                source={back}
                style={{ resizeMode: 'contain', height: 35, width: 100}}
            />
          </TouchableOpacity>
        </View>

        {/* Контейнер с именем и статусом */}
        <View style={{ flex:1 ,flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black'}}>Username</Text>
          <Text style={{ color: 'gray' }}>Status</Text>
        </View>

        <View style={{ alignItems: 'flex-end',  width: 100}}>
            <Image source={ava} style={{ width: 50, height: 50, borderRadius: 25 }}/>
        </View>
      </View>

      {/* Список, который листается */}
      <ScrollView>
        {/* Здесь добавьте элементы списка */}
        <View style={{ padding: 16 }}>
          <Text>List Item 1</Text>
        </View>
        <View style={{ padding: 16 }}>
          <Text>List Item 2</Text>
        </View>
        {/* ... */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
