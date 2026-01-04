import * as React from "react";
import { StyleSheet, Text, Pressable, View, Modal, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSettings } from '../../api/settingsApi';

const AITherapy = () => {
  const [selectedTherapy, setSelectedTherapy] = React.useState('Cognitive-Behavioral');
  const [showModal, setShowModal] = React.useState(false);
  const [tempTherapy, setTempTherapy] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    loadUserDataAndSettings();
  }, []);

  const loadUserDataAndSettings = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.user_id);
      }

      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setSelectedTherapy(parsedSettings.therapyType);
      } else {
        const defaultSettings = {
          voiceType: "William",
          language: "English",
          therapyType: "Cognitive-Behavioral"
        };
        await AsyncStorage.setItem('userSettings', JSON.stringify(defaultSettings));
        setSelectedTherapy(defaultSettings.therapyType);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleTherapySelect = (therapy: string) => {
    setTempTherapy(therapy);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const currentSettings = await AsyncStorage.getItem('userSettings');
      const parsedSettings = currentSettings ? JSON.parse(currentSettings) : {
        voiceType: "William",
        language: "English"
      };

      const updatedSettings = {
        ...parsedSettings,
        therapyType: tempTherapy
      };

      const response = await updateSettings(
        userId,
        updatedSettings.voiceType,
        updatedSettings.language,
        tempTherapy
      );

      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      setSelectedTherapy(tempTherapy);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating therapy type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ConfirmationModal = () => (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Therapy Change</Text>
          <Text style={styles.modalText}>
            Are you sure you want to change the therapy type to {tempTherapy}?
          </Text>
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.modalButton, styles.confirmButton]} 
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.modalButtonText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderTherapyButton = (therapy: string) => (
    <Pressable 
      style={[
        styles.button, 
        selectedTherapy === therapy && styles.selectedButton
      ]}
      onPress={() => handleTherapySelect(therapy)}
    >
      <Text style={[
        styles.buttonText, 
        selectedTherapy === therapy && styles.selectedButtonText
      ]}>
        {therapy}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Therapy Type</Text>

      <View style={styles.row}>
        {renderTherapyButton("Cognitive-Behavioral")}
        {renderTherapyButton("Cognitive")}
      </View>

      <View style={styles.row}>
        {renderTherapyButton("Behavioral")}
        {renderTherapyButton("Dialectical")}
      </View>

      <View style={styles.row}>
        {renderTherapyButton("Psychodynamic")}
        {renderTherapyButton("Psychoanalytic")}
      </View>

      <View style={styles.row}>
        {renderTherapyButton("Interpersonal")}
        {renderTherapyButton("Humanistic")}
      </View>

      <ConfirmationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    paddingHorizontal: 20,
    paddingVertical: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 54,
    borderWidth: 0.5,
    borderColor: "#a7a7a7",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fcfaf0",
  },
  selectedButton: {
    backgroundColor: "#474d41",
  },
  buttonText: {
    fontSize: 13,
    color: "#979797",
    textAlign: "center",
  },
  selectedButtonText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fcfaf0',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#979797',
  },
  confirmButton: {
    backgroundColor: '#474d41',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  }
});

export default AITherapy;
