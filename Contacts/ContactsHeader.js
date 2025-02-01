import React from 'react';
import { View, Text} from 'react-native';

const ContactsHeader = ({ }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderColor: '#E9E9EB' }}>
        <Text style={{fontSize: 21, fontWeight: 600}}> Контакты </Text>
    </View>
  );
};

export default ContactsHeader;
