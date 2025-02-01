import React, { useState, useEffect } from 'react';
import { AppState, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

import { FIREBASE_DB } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import UserListContainer from './UserListContainer';
import ProfileHeader from './ProfileHeader';

import SearchContainer from '../SearchContainer';
import ButtonContainer from '../ButtonContainer';


const Main = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can add additional logic here, such as filtering the user list.
  };
  
  const getFilteredAndSortedUsers = () => {
    // Filter the user list based on the search query and exclude the current user
    const filteredUsers = users.filter(user => user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) && user.id !== currentUserId);
  
    // Sort the filtered users alphabetically by nickname
    const sortedUsers = filteredUsers.sort((a, b) => a.nickname.localeCompare(b.nickname));
  
    return sortedUsers;
  };

  
  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(FIREBASE_DB, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
  
      const usersData = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push({
          id: doc.id,
          nickname: userData.nickname,
          status: userData.status,
          avatarUrl: userData.avatarUrl,
        });
      });
  
      setUsers(usersData);
    } catch (error) {
      console.error('Не удалось получить пользователей', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const auth = getAuth();

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              // User confirmed logout
              // Get the user ID from AsyncStorage
              const userId = await AsyncStorage.getItem('userId');
  
              // Set the user status to 'Offline' in Firebase
              await updateUserStatus('Offline');
  
              // Remove the user ID from AsyncStorage
              await AsyncStorage.removeItem('userId');
  
              // Navigate to the Login screen
              navigation.navigate('Login');
            },
            style: 'destructive', // This will make the text red
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Logout failed', error.message);
    }
  };
  

  const updateUserStatus = async (status) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const db = getDatabase();
      const userStatusRef = ref(db, `users/${userId}/status`);
      await set(userStatusRef, status);
      console.log('User status updated successfully');
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  const getUserInfo = async (id) => {
    try {
      const userRef = doc(FIREBASE_DB, 'users', id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setNickname(userSnap.data().nickname);
        setAvatarUrl(userSnap.data().avatarUrl);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Failed to get user info', error);
    }
  };

  const handleUserStatusChange = (status) => {
    setUserStatus(status);
  };

  const getUserStatus = async (userId) => {
    const db = getDatabase();
    const userStatusRef = ref(db, `users/${userId}/status`);

    onValue(userStatusRef, (snapshot) => {
      const status = snapshot.val();
      handleUserStatusChange(status);
    });
  };

  useEffect(() => {
    const unsubscribeAuthStateChange = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is signed in:', user.uid);
        
        // Update user status to 'Online'
        updateUserStatus('online');
        
        // Handle the signed-in state
      } else {
        console.log('User is signed out');
        
        // Update user status to 'Offline' when the user signs out
        updateUserStatus('offline');
        
        // Handle the signed-out state
      }
    });
  
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        updateUserStatus('Online');
      } else {
        updateUserStatus('Offline');
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    // Cleanup functions
    return () => {
      unsubscribeAuthStateChange();
      subscription.remove();
      updateUserStatus('Offline');
    };
  }, [auth]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Отключаем жесты для этого экрана
    });
  }, [navigation]);
  

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setCurrentUserId(id);
        getUserInfo(id);
        getUserStatus(id);
      } catch (error) {
        console.error('Failed to get user id', error);
      }
    };
    
    getUserId();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: 'white' }}>

      <StatusBar barStyle="dark-content" />

      <ProfileHeader avatarUrl={avatarUrl} nickname={nickname} userStatus={userStatus} currentUserId={currentUserId}/>

      <SearchContainer handleSearch={handleSearch} searchQuery={searchQuery} />

      <UserListContainer users={getFilteredAndSortedUsers()} />

      <ButtonContainer handleLogout={handleLogout} />

    </SafeAreaView>
  );
};

export default Main;
