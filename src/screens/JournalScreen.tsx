import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type JournalStackParamList = {
  JournalMain: undefined;
  UserJournals: undefined;
};

type JournalScreenNavigationProp = StackNavigationProp<JournalStackParamList, 'JournalMain'>;

const JournalScreen = () => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  const [coverImage, setCoverImage] = React.useState(4); // Default to 4

  React.useEffect(() => {
    const loadCoverChoice = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { cover_choice } = JSON.parse(userData);
          if ([1, 2, 3, 4].includes(Number(cover_choice))) {
            setCoverImage(Number(cover_choice));
          }
        }
      } catch (error) {
        console.error('Error loading cover choice:', error);
      }
    };

    loadCoverChoice();
  }, []);

  const Image1 = () => {
    const getImageSource = () => {
      switch (coverImage) {
        case 1:
          return require('../assets/journalCovers/1.png');
        case 2:
          return require('../assets/journalCovers/2.png');
        case 3:
          return require('../assets/journalCovers/3.png');
        case 4:
        default:
          return require('../assets/journalCovers/4.png');
      }
    };

    return (
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate('UserJournals')}
      >
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={getImageSource()}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image1 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
  },
  imageContainer: {
    position: "absolute",
    top: 70, // Adjust space from the top
    left: 30, // Adjust space from the left
    width: 140, // Adjust width of the image container
    height: 179, // Match the height defined in Image1
  },
  icon: {
    borderRadius: 7,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  pressable: {
    height: 179,
    width: "90%",
  },
});

export default JournalScreen;
