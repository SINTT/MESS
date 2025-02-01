import React from 'react';
import { View, Image, TextInput } from 'react-native';

import searchIco from './assets/search.png';

const SearchContainer = ({ handleSearch }) => {
    
  return (
    <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E9E9EB', padding: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#F5F5F5', borderRadius: 12 }}>
        <Image source={searchIco} style={{ width: 24, height: 24, margin: 8, opacity: 0.2 }} />
        <TextInput
          style={{ flex: 1, height: 40, borderRadius: 12, fontSize: 18 }}
          placeholder="Поиск"
          onChangeText={(text) => handleSearch(text)}
        />
      </View>
    </View>
  );
};

export default SearchContainer;
