import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const Settings = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text>Текст</Text>
        <Button title="Кнопка" onPress={() => {}} />
      </View>
      <View style={styles.middleContainer}>
        <Image
          style={styles.image}
          source={{ uri: 'ссылка на ваше изображение' }}
        />
        <Text>Текст</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Button title="Изменить фотографию" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEEF4',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  middleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default Settings;
