import React, { useState, useEffect } from 'react';
import { ImageBackground, SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';

import ava1 from '../assets/ava.jpeg';
import paperclip from '../assets/paperclip2.png';
import Stickers from '../assets/Stickers.png';
import sendButt from '../assets/sendButt2.png';
import backButt from '../assets/back_butt.png';
import backgroundChat from '../assets/backgroundChat.png';

import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';

import MyMessageItem from './MyMessageItem';
import TheirMessageItem from './TheirMessageItem';

import * as ImagePicker from 'expo-image-picker'; // Импорт библиотеки для выбора изображений
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const firestore = getFirestore();
  const route = useRoute();
  const { nickname, status, userId, friendId, } = route.params;
  const navigation = useNavigation();
  
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp'));

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result.assets[0].uri); // Добавьте эту строку для отладки
    }
  };

  // Генерация уникального идентификатора для диалога
  const ids = [userId, friendId].sort();
  const chatId = `${ids[0]}_${ids[1]}`;

  const [isSending, setIsSending] = useState(false);

  // Определение функции sendToFirestore вне sendMessage
const sendToFirestore = async (msg, imageUrl = null) => {
  const docData = {
    text: msg,
    sender: nickname,
    timestamp: Date.now(),
    image: imageUrl,
  };

  if (msg.length > 0 || imageUrl) {
    // Используйте chatId вместо 'messages'
    await addDoc(collection(firestore, chatId), docData);
  }
};

const sendMessage = async () => {
  if ((message.length > 0 || selectedImage) && !isSending) {
    setIsSending(true);
    const msg = message.replace(/\s+/g, ' ').trim();
    setMessage('');
    let imageUrl = null;

    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Failed to upload image', error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            imageUrl = downloadURL;
            sendToFirestore(msg, imageUrl); // Передаем msg и imageUrl в функцию sendToFirestore
            setIsSending(false); // Переносим setIsSending(false) сюда, чтобы установить его после отправки в Firestore
          });
        }
      );
    } else {
      sendToFirestore(msg); // Передаем msg в функцию sendToFirestore
      setIsSending(false); // Устанавливаем setIsSending(false) сразу после отправки сообщения в Firestore
    }
  }
};


  // Чтение сообщений
  useEffect(() => {
    const messagesRef = collection(firestore, chatId);
    const messagesQuery = query(messagesRef, orderBy('timestamp'));

    console.log("User ID: ", userId);
    console.log("Friend ID: ", friendId);

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      let newMessages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          ...data,
          timestamp: data.timestamp,
        });
      });
      setMessages(newMessages);
  });

  return () => unsubscribe();

}, []);

  

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 6, borderBottomWidth: 1, borderColor: '#E9E9EB' }}>

          <TouchableOpacity
            style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigation.goBack()}>
            <Image source={backButt} style={{ height: 38, width: 38, opacity: 0.5 }} />
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: 40}}>
            <Text style={{ fontSize: 21, fontWeight: '700', color: 'black' }}>{nickname}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>{status}</Text>
          </View>
          <Image
            source={ava1}
            style={{ width: 48, height: 48, borderRadius: 25 }}
          />
        </View>

        <ImageBackground
          source={backgroundChat}
          style={{ flex: 1 }}
          blurRadius={5}>
          <ScrollView>
            {messages.map((msg, index) => {
              if (msg.sender === nickname) {
                return <MyMessageItem key={index} message={msg.text} timestamp={msg.timestamp} image={msg.image} />;
              } else {
                return <TheirMessageItem key={index} message={msg.text} timestamp={msg.timestamp} image={msg.image} />;
              }
            })}
          </ScrollView>
        </ImageBackground>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={47}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#F5F5F5', borderTopWidth: 1, borderColor: '#E9E9EB', padding: 6 }}>

            <TouchableOpacity style={{ height: 38, width: 38, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
              <Image source={paperclip} style={{ height: 28, width: 28 }} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', flexDirection: 'row', minHeight: 38, backgroundColor: 'white', borderRadius: 25, borderWidth: 2, borderColor: '#D9D9D9', flex: 1, marginHorizontal: 8 }}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={{ height: 28, width: 28 }} />
              ) : null}
              <TextInput style={{ flex: 1, textAlign: 'left', textAlignVertical: 'center', paddingLeft: 12, fontSize: 18 }}
                placeholder="Сообщение"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}/>
              
              <TouchableOpacity>
                <Image source={Stickers} style={{ height: 24, width: 24, margin: 4, opacity: 0.6 }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ height: 38, width: 38}} onPress={sendMessage}>
              <Image source={sendButt} style={{ height: 38, width: 38 }} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
