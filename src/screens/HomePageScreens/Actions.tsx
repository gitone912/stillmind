import * as React from "react";
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '../../store';
import { getTodaysTasks, updateTaskCompletion, reduceTaskCompletion, deleteTask } from '../../store/slices/actionSlice';
import { fetchUserById } from '../../store/slices/authSlice';
import { Swipeable } from 'react-native-gesture-handler';

interface UserData {
  user_id: string;
  email: string;
  name: string;
  // ... other fields
}

const ActionScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [timeUntilReset, setTimeUntilReset] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  const [isUndoModal, setIsUndoModal] = React.useState(false);

  React.useEffect(() => {
    getUserData();
  }, []);

  React.useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        // Remove the 'userData|' prefix and then parse
        const jsonStr = userDataString.replace('userData|', '');
        const userData: UserData = JSON.parse(jsonStr);
        setUserId(userData.user_id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTasks = () => {
    if (userId) {
      dispatch(getTodaysTasks(userId));
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      await dispatch(updateTaskCompletion({ taskId, isCompleted: true }));
      if (userId) {
        await dispatch(fetchUserById(userId)); // Fetch updated user data
      }
      fetchTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTaskPress = (taskId: string, isCompleted: boolean) => {
    setSelectedTask(taskId);
    setIsUndoModal(isCompleted);
    setModalVisible(true);
  };

  const confirmTaskCompletion = async () => {
    if (selectedTask) {
      await handleTaskCompletion(selectedTask);
      setModalVisible(false);
      setSelectedTask(null);
    }
  };

  const handleUndoTaskCompletion = async () => {
    if (selectedTask) {
      try {
        await dispatch(reduceTaskCompletion(selectedTask));
        if (userId) {
          await dispatch(fetchUserById(userId)); // Fetch updated user data
        }
        fetchTasks(); // Refresh tasks after updating
      } catch (error) {
        console.error('Error undoing task:', error);
      }
      setModalVisible(false);
      setSelectedTask(null);
    }
  };

  const calculateTimeUntilReset = () => {
    const now = new Date();
    // Get current UTC date
    const utcNow = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    ));

    // Get next UTC midnight
    const utcTomorrow = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));

    const diff = utcTomorrow.getTime() - utcNow.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s (UTC)`;
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilReset(calculateTimeUntilReset());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderRightActions = (taskId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteTask(taskId)}
      >
        <Image
          source={require('../../assets/delete.png')}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    );
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await dispatch(deleteTask(taskId));
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderActionItem = ({ item }: { item: any }) => (
    <Swipeable
      enabled={!item.is_completed}
      renderRightActions={() =>
        !item.is_completed ? renderRightActions(item.task_id) : null
      }
    >
      <View style={styles.actionRow}>
        <View style={[styles.actionItem, item.is_completed && styles.highlightedAction]}>
          <Text style={item.is_completed ? styles.actionTextHighlighted : styles.actionText}>
            {item.task_name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.tickBox}
          onPress={() => handleTaskPress(item.task_id, item.is_completed)}
        >
          <Image
            style={styles.actionIcon}
            resizeMode="cover"
            source={
              item.is_completed
                ? require("../../assets/tickmark.png")
                : require("../../assets/tickmarkgrey.png")
            }
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  const renderSections = () => {
    const completedTasks = tasks.filter((task: { is_completed: any; }) => task.is_completed);
    const uncompletedTasks = tasks.filter((task: { is_completed: any; }) => !task.is_completed);

    return (
      <>
        {uncompletedTasks.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>To Do</Text>
            <FlatList
              data={uncompletedTasks}
              renderItem={renderActionItem}
              keyExtractor={(item) => item.task_id}
              scrollEnabled={false}
            />
          </>
        )}

        {completedTasks.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Completed</Text>
            <FlatList
              data={completedTasks}
              renderItem={renderActionItem}
              keyExtractor={(item) => item.task_id}
              scrollEnabled={false}
            />
          </>
        )}
      </>
    );
  };

  const renderInstructions = () => (
    <Text style={styles.instructionText}>
      Swipe right on incomplete tasks to delete them
    </Text>
  );

  if (!userId || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#41ad49" />
      </View>
    );
  }

  if (error || !tasks || tasks.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.messageText}>Do Journal Sessions to get your tasks for today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actions</Text>
      <Text style={styles.timerText}>Tasks reset in: {timeUntilReset}</Text>
      <Text style={styles.subheaderText}>
        Based on your journal entries, here are recommended actions that you need to complete to improve your mental health.
      </Text>
      {renderInstructions()}

      <ScrollView
        contentContainerStyle={styles.actionsList}
        showsVerticalScrollIndicator={false}
      >
        {renderSections()}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {isUndoModal
                ? "Do you want to undo this completed task?"
                : "Are you sure you want to mark this task as complete?"}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={isUndoModal ? handleUndoTaskCompletion : confirmTaskCompletion}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: 'Ova'
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",

  },
  subheaderText: {
    fontSize: 14,
    color: "#979797",
    textAlign: "center",
    marginBottom: 20,
  },
  actionsList: {
    flexGrow: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10
  },
  actionItem: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 7,
    borderStyle: "solid",
    borderColor: "#a7a7a7",
    borderWidth: 0.5,
    width: "100%",
    minHeight: 54,
  },
  highlightedAction: {
    backgroundColor: "#41ad49",
    borderColor: "#41ad49",
  },
  actionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    display: "flex",
  },
  actionTextHighlighted: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    display: "flex",
  },
  tickBox: {
    width: 54,
    alignSelf: 'stretch',
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6d6d6d",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  messageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Inter-Regular",
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#41ad49',
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  confirmButtonText: {
    color: 'white',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: 'Inter-Regular',
  },
  deleteAction: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 7,
  },
  deleteActionText: {
    color: 'white',
    fontWeight: '600',
    padding: 20,
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default ActionScreen;
