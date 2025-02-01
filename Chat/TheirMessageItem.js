import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TheirMessageItem = ({ message, timestamp, image }) => {
  // Функция для преобразования временной метки в читаемый формат
  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  return (
    <View style={[styles.container, message.length > 30 && styles.expandedContainer]}>
      <View style={{ flexDirection: 'column'}}>

        {message && <Text style={styles.message}>{message}</Text>}
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Text style={styles.timestamp}>{convertTimestamp(timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    padding: 5,
    marginBottom: 5,
    marginLeft: 5,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    maxWidth: 300, 
    minWidth: 30,
    flexDirection: 'row',
    // Добавьте эти строки для создания тени
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },

  expandedContainer: {
    width: '100%',
  },
  
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 15,

  },
  
  message: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  
  timestamp: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 5,
    fontSize: 11,
    textAlign: 'right',
  },
});

export default TheirMessageItem;
