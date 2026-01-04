import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, Pressable, View, Modal, Linking, TextInput, ActivityIndicator } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser } from "../api/authApi";
import { updateUserName } from "../api/authApi";

type SettingsStackParamList = {
  SettingsMain: undefined;
  AITherapy: undefined;
  Language: undefined;
  AICharacter: undefined;
  Subscription: undefined;
  Logout: undefined;
  BuySubscriptions: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsMain'>;
const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [userSubscription, setUserSubscription] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name);
          setUserEmail(parsedData.email);
          // Set subscription plan
          setUserSubscription(parsedData.subscription || 'Free Tier');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateName = async () => {
    setIsLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const response = await updateUserName({
          userId: parsedData.user_id,
          name: newName
        });

        // Update local storage and state with new name
        parsedData.name = newName;
        await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
        setUserName(newName);
        setUpdateMessage('Name updated successfully');
        setShowEditModal(false);
      }
    } catch (error) {
      setUpdateMessage('Failed to update name');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Profile Image */}
      <View style={styles.userProfileImageContainer}>
        {/* <Image
          style={styles.userProfileImage}
          source={require("../assets/settingsIcons/userprofile.png")}
        /> */}
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/settingsIcons/user.png")}
        />
        <View style={styles.userInfoTextContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <Text style={styles.userSubscription}>{userSubscription}</Text>
        </View>
        <Pressable
          style={styles.editButton}
          onPress={() => {
            setNewName(userName);
            setShowEditModal(true);
          }}
        >
          <Image
            style={styles.editIcon}
            source={require("../assets/settingsIcons/edit.png")}
          />
        </Pressable>
      </View>

      {/* Options List */}
      <View style={styles.menuContainer}>
        {menuOptions.map((option, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (option.title === "Log out") {
                setShowLogoutModal(true);
              } else if (option.title === "AI Therapy Type") {
                navigation.navigate("AITherapy");
              } else if (option.title === "Language") {
                navigation.navigate("Language");
              } else if (option.title === "AI Character") {
                navigation.navigate("AICharacter");
              } else if (option.title === "Buy Leaves") {
                navigation.navigate("Subscription");
              } else if (option.title === "Subscriptions") {
                navigation.navigate("BuySubscriptions");
              } else if (option.title === "Contact support") {
                Linking.openURL('mailto:support@stillmind.ai');
              } else if (option.title === "Join Discord Community" ||
                option.title === "Write a review") {
                Linking.openURL('https://discord.gg/');
              }
            }}
          >
            <View style={styles.menuItemLeft}>
              <Image
                style={styles.menuIcon}
                source={option.icon}
              />
              <Text style={styles.menuText}>{option.title}</Text>
            </View>
            <Image
              style={styles.arrowIcon}
              source={require("../assets/settingsIcons/sidearrow.png")}
            />
          </Pressable>
        ))}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setShowLogoutModal(false);
                  navigation.navigate("Logout");
                }}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Name Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleUpdateName}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.updateButtonText}>Update</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Message */}
      {updateMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{updateMessage}</Text>
        </View>
      ) : null}

    </View>
  );
};

const menuOptions = [
  {
    title: "Buy Leaves",
    icon: require("../assets/leaf.png"),
  },
  {
    title: "Subscriptions",
    icon: require("../assets/settingsIcons/1.png"),
  },
  {
    title: "Language",
    icon: require("../assets/settingsIcons/2.png"),
  },
  {
    title: "AI Therapy Type",
    icon: require("../assets/settingsIcons/3.png"),
  },
  {
    title: "AI Character",
    icon: require("../assets/settingsIcons/4.png"),
  },
  {
    title: "Join Discord Community",
    icon: require("../assets/settingsIcons/5.png"),
  },
  {
    title: "Write a review",
    icon: require("../assets/settingsIcons/6.png"),
  },
  {
    title: "Contact support",
    icon: require("../assets/settingsIcons/7.png"),
  },
  {
    title: "Log out",
    icon: require("../assets/settingsIcons/8.png"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  userProfileImageContainer: {
    alignItems: "center",
    marginBottom: 20, // Add some spacing below the image
  },
  userProfileImage: {
    width: 342, // Set width
    height: 160, // Set height
    resizeMode: "cover", // Ensure the image fills the dimensions properly
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Reduced spacing below user info
  },
  profileImage: {
    width: 45, // Reduced size
    height: 45,
    borderRadius: 22.5,
  },
  userInfoTextContainer: {
    flex: 1,
    marginLeft: 10, // Reduced margin
  },
  userName: {
    fontSize: 12, // Reduced font size
    fontWeight: "600",
    color: "#000",
  },
  userEmail: {
    fontSize: 12, // Reduced font size
    color: "#6d6d6d",
  },
  userSubscription: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2,
  },
  editButton: {
    padding: 4, // Reduced padding
  },
  editIcon: {
    width: 16, // Reduced size
    height: 16,
  },
  menuContainer: {
    width: "100%",
    alignSelf: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 15, // Added horizontal padding
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 18, // Reduced size
    height: 18,
    marginRight: 10, // Reduced margin
  },
  menuText: {
    fontSize: 13, // Reduced font size
    color: "#000",
  },
  arrowIcon: {
    width: 14, // Reduced size
    height: 14,
    tintColor: "#6d6d6d",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messageContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  messageText: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
});

export default SettingsScreen;
