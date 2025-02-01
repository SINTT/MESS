import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Link from '../assets/Link.png'

const ProfileHeader = ({ avatarUrl, nickname, userStatus, currentUserId }) => {
  return (
    <View style={{ height: 62,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderColor: '#E9E9EB', backgroundColor: 'white'}}>
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: 48, height: 48, borderRadius: 25 }}
      />
      <View style={{ flex: 1, marginLeft: 12, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: 40}}>
        {currentUserId && (
          <Text style={{ fontSize: 21, fontWeight: '700', color: 'black' }}>
            {nickname}
          </Text>
        )}
        <Text style={{ color: 'gray', fontWeight: '500' }}>{userStatus}</Text>
      </View>
      
          <TouchableOpacity style= {{marginLeft: 8}}>
          <Image
            source= {Link}
            style={{ width: 38, height: 38, borderRadius: 25 }}
          />
          </TouchableOpacity>

    </View>
  );
};

export default ProfileHeader;
