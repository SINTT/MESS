import React from 'react';
import { View } from 'react-native';

import UserList from './UserList';

const UserListContainer = ({ users }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <UserList users={users} />
    </View>
  );
};

export default UserListContainer;
