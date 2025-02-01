import React, {useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';

import { getFirestore, getDoc, setDoc, doc, updateDoc, arrayUnion, arrayRemove, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import userPlus from '../assets/user-plus.png';
import friendIco from '../assets/friend-ico.png';
import { getAuth } from 'firebase/auth';


const UserItem = ({ id, nickname, avatarUrl, status }) => {
  const navigation = useNavigation();
  const [isFriend, setIsFriend] = useState(false);
  const auth = getAuth();

  const handleUserPress = async () => {
    // Получение id текущего пользователя из асинхронного хранилища
    const userId = await AsyncStorage.getItem('userId');
    
    console.log("handleUserPress userId: ", userId);
    console.log("handleUserPress friendId: ", id);
  
    // Перенаправление на ChatScreen и передача данных пользователя
    navigation.navigate('ChatScreen', { userId, friendId: id, nickname, status });
  };
  
  

  useEffect(() => {
    const checkFriendStatus = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const db = getFirestore();
      const userFriendsRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userFriendsRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.friends && userData.friends.includes(id)) {
          setIsFriend(true);
        }
      }
    };
    checkFriendStatus();
  }, [id]);

  const handleFriendPress = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const friendId = id; 
    const db = getFirestore();
    const userFriendsRef = doc(db, `users/${userId}`);
    const friendFriendsRef = doc(db, `users/${friendId}`);
    
  
  
    if (isFriend) {
      Alert.alert(
        "Удалить друга",
        "Вы действительно хотите удалить пользователя?",
        [
          {
            text: "Отмена",
            style: "cancel"
          },
          { text: "Да", onPress: async () => {
              setIsFriend(false);
              await updateDoc(userFriendsRef, { friends: arrayRemove(friendId) });
              await updateDoc(friendFriendsRef, { friends: arrayRemove(userId) });
            }}
          ]
        );
      } 
      
      // Проверьте, существуют ли документы
    const userDoc = await getDoc(userFriendsRef);
    const friendDoc = await getDoc(friendFriendsRef);
  
    // Если документы не существуют, создайте их
    if (!userDoc.exists()) {
      await setDoc(userFriendsRef, { friends: {} });
    }
    if (!friendDoc.exists()) {
      await setDoc(friendFriendsRef, { friends: {} });
    }

      else {
        try {
          setIsFriend(true);
          await updateDoc(userFriendsRef, { friends: arrayUnion(friendId) });
          await updateDoc(friendFriendsRef, { friends: arrayUnion(userId) });
        } catch (error) {
          console.error('Ошибка при обновлении базы данных:', error);
          setIsFriend(false);
        }
      }
  };
  

  return (
    <TouchableOpacity onPress={handleUserPress} style={{ borderRadius: 12, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, marginTop: 8, marginHorizontal: 8 }}>
      {/* Фотография */}
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: 42, height: 42, borderRadius: 25 }}
      />

      {/* Контейнер с именем */}
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{nickname}</Text>
        <Text style={{ fontSize: 12, fontWeight: 'medium', color: 'gray' }}>{status}</Text>
      </View>

      {/* Контейнер с иконкой */}
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={handleFriendPress}>
          <Image style={{ width: 30, height: 30 }} source={isFriend ? friendIco : userPlus} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
 
export default UserItem;
