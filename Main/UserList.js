import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";

import UserItem from './UserItem';

const UserList = ({ users }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showFriendsOnly, setShowFriendsOnly] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserIdAndFriends = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setCurrentUserId(id);

        const db = getFirestore();
        const userRef = doc(db, 'users', id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setFriends(userDoc.data().friends);
        }
      } catch (error) {
        console.error('Failed to get user id or friends', error);
      }
    };
    
    getUserIdAndFriends();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', currentUserId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        setFriends(userDoc.data().friends);
      }
    } catch (error) {
      console.error('Failed to refresh user data', error);
    }
  
    setRefreshing(false);
  }, [currentUserId]);

  const displayedUsers = showFriendsOnly ? users.filter(user => friends.includes(user.id)) : users;

  // Check if there are no users in the displayedUsers array
  const noUsersFound = displayedUsers.length === 0;

  return (
    <FlatList
      data={noUsersFound ? users : displayedUsers} // Display all users if no users are found
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const db = getDatabase();
        let status;
        onValue(ref(db, `users/${item.id}/status`), (snapshot) => {
          status = snapshot.val();
        });

        return (
          <UserItem
            id={item.id}
            nickname={item.nickname}
            status={status}
            avatarUrl={item.avatarUrl}
          />
        );
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

export default UserList;
