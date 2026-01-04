import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCurrentJournal } from '../../store/slices/journalSlice';
import * as journalApi from '../../api/journalApi';

const ChatJournal = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGreetingLoading, setIsGreetingLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    setIsGreetingLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      const { name } = userData ? JSON.parse(userData) : { name: 'User' };

      const { greeting } = await journalApi.getGreeting(name);
      setMessages([{ id: '1', text: greeting, sender: 'bot' }]);
      setIsSessionActive(true);
    } catch (error) {
      console.error(error);
    }
    setIsGreetingLoading(false);
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      const { name } = userData ? JSON.parse(userData) : { name: 'User' };

      // Modified to remove 'bot:' prefix
      const history = messages.map(m => `${m.sender === 'user' ? 'User: ' : ''}${m.text}`);
      const { response } = await journalApi.sendMessage(inputText, name, history);

      setMessages(prev => [...prev, { id: Date.now().toString(), text: response, sender: 'bot' }]);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const endSession = () => {
    // Modified to remove 'bot:' prefix
    const content = messages.map(m => `${m.sender === 'user' ? 'User: ' : ''}${m.text}`).join('\n\n');
    dispatch(setCurrentJournal({
      content,
      title: 'Chat Session',
      date: new Date().toISOString(),
      type: 'chat',
      chatHistory: messages.map(m => m.text)
    }));
    navigation.navigate('AnalyseJournal');
  };

  const renderItem = ({ item }: { item: { id: string; text: string; sender: string } }) => (
    <View style={[styles.messageContainer, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
      <Text style={[styles.messageText, item.sender === 'user' && styles.userMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.sessionButton,
            styles.stopButton,
            isGreetingLoading && styles.loadingButton
          ]}
          onPress={endSession}
          disabled={isGreetingLoading}
        >
          {isGreetingLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sessionButtonText}>End Session</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      {isSessionActive && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FCFAF0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#394239',
    fontFamily: 'Inter-SemiBold',
  },
  chatContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 20,
    maxWidth: '80%',
    elevation: 1,
  },
  botMessage: {
    backgroundColor: '#394239',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userMessage: {
    backgroundColor: '#F7F6F0',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
    borderRadius: 12,
    borderStyle: "solid",
    borderColor: "#b2b0b0",
    borderWidth: 0.5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FCFAF0'
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F7F6F0',
    marginRight: 8,
    fontSize: 14,
    color: '#000000',
  },
  sessionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#394239',
  },
  stopButton: {
    backgroundColor: '#8B0000',
  },
  loadingButton: {
    backgroundColor: '#2a332a',
  },
  sendButton: {
    backgroundColor: '#394239',
    padding: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontFamily: 'Inter-Medium',
  },
  sessionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});

export default ChatJournal;
