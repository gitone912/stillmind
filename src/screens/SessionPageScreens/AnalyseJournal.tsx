import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Alert, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { compileJournal, getJournalSummary, getSatisfactionScore, getKeywords, getRecommendedActions, getJournalTitle } from '../../store/slices/analyseSlice';
import { createTask } from '../../store/slices/actionSlice'; // Add this import
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as analyseApi from '../../api/analyseApi';  // Add this import
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import LoadingAnimation from '../../components/LoadingAnimation';

type NavigationProps = NavigationProp<ParamListBase>;

const AnalyseJournal: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const currentJournal = useSelector((state: RootState) => state.journal.currentJournal);
  const { compiledJournal, summary, satisfactionScore, keywords, loading, isAnalyzing, actions, error, title } = useSelector((state: RootState) => state.analyse);

  // Add new state for edited journal
  const [isEditing, setIsEditing] = useState(false);
  const [editedJournal, setEditedJournal] = useState('');
  const [addedActions, setAddedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentJournal?.content) {
      console.log('Dispatching compile journal...');
      dispatch(compileJournal(currentJournal.content))
        .then((result) => {
          if (result.payload) {
            // Set the initial edited journal value
            setEditedJournal(result.payload);
            console.log('Journal compiled, dispatching other actions...');
            // First get the summary
            dispatch(getJournalSummary(result.payload))
              .then((summaryResult) => {
                if (summaryResult.payload) {
                  // After getting summary, get the title based on it
                  dispatch(getJournalTitle(summaryResult.payload));
                }
              });

            // Dispatch other actions in parallel
            Promise.all([
              dispatch(getSatisfactionScore(result.payload)),
              dispatch(getKeywords(result.payload)),
              dispatch(getRecommendedActions(result.payload))
            ]).then(() => {
              console.log('All actions completed');
            });
          }
        });
    }
  }, [currentJournal, dispatch]);

  const getEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '😕';
    return '😢';
  };

  const handleAddTask = async (taskName: string) => {
    if (addedActions.has(taskName)) {
      Alert.alert('Already Added', 'This action has already been added to your tasks.');
      return;
    }

    try {
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.user_id;

      Alert.alert(
        'Add Task',
        'Do you want to add this task to your daily tasks?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await dispatch(createTask({
                  userId,
                  taskName,
                  completion_points: 0
                })).unwrap();

                // Add the action to the set of added actions
                setAddedActions(prev => new Set([...prev, taskName]));
                Alert.alert('Success', 'Task added successfully!');
              } catch (error: any) {
                if (error?.message?.includes('Daily task limit reached. You can only create 6 tasks per day.')) {
                  Alert.alert('Limit Reached', 'You cannot add more than 6 tasks per day.');
                } else {
                  Alert.alert('Sorry', 'Daily task limit reached. You can only create 6 tasks per day.');
                }
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCompleteSession = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User data not found');
        return;
      }
      const userData = JSON.parse(userDataString);

      Alert.alert(
        'Complete Session',
        'Do you want to save this journal entry?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
                const actionsArray = actions?.recommendedActions
                  ? actions.recommendedActions.split(',').map(a => a.trim())
                  : [];

                // Always use editedJournal if it exists, otherwise fall back to compiledJournal
                const finalContent = editedJournal || compiledJournal;

                console.log('Saving journal with content:', finalContent); // Debug log

                const journalData = {
                  userId: userData.user_id,
                  type: title || 'Untitled Journal',
                  originalContent: currentJournal?.content || '',
                  content: finalContent,
                  moodEmoji: getEmoji(satisfactionScore),
                  moodKeywords: keywordsArray,
                  summary: summary || '',
                  actions: actionsArray,
                };

                console.log('Journal data being sent:', journalData); // Debug log

                // Save journal entry
                const response = await analyseApi.createJournal(journalData);
                console.log('Journal created successfully:', response);

                // Save the current timestamp in user's local timezone
                const now = new Date();
                await AsyncStorage.setItem('lastJournalTimestamp', now.toISOString());

                Alert.alert('Success', 'Journal entry saved successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('SessionMain')
                  }
                ]);
              } catch (error: any) {
                console.error('Error saving journal:', error);
                Alert.alert(
                  'Error',
                  error.message || 'Failed to save journal entry. Please try again.'
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error handling complete session:', error);
      Alert.alert('Error', 'Something went wrong while saving the journal');
    }
  };

  const handleRestartSession = () => {
    Alert.alert(
      'Restart Session',
      'Are you sure you want to restart the session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('SessionMain')
        },
      ]
    );
  };

  // Add this helper function
  const getActionsList = () => {
    if (!actions?.recommendedActions) return [];
    return actions.recommendedActions.split(',').map(action => action.trim());
  };

  // Replace the loading view with the new component
  if (loading.compile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingAnimation message="Analyzing your journal entry..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!loading.compile && compiledJournal && (
          <Pressable style={styles.editButton} onPress={handleEditToggle}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Done Editing' : 'Edit Journal'}
            </Text>
          </Pressable>
        )}
        <View style={styles.card}>
          <Text style={styles.date}>
            {new Date(currentJournal?.date || Date.now()).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>

          <View style={styles.titleContainer}>
            {loading.title || loading.compile ? (
              <LoadingAnimation message="Generating title..." />
            ) : title ? (
              <Text style={styles.title}>{title}</Text>
            ) : null}
          </View>



          {isEditing ? (
            <TextInput
              style={[styles.body, styles.editInput]}
              multiline
              value={editedJournal}
              onChangeText={setEditedJournal}
            />
          ) : (
            <Text style={styles.body}>
              {editedJournal || compiledJournal || currentJournal?.content || 'No content available'}
            </Text>
          )}
        </View>

        {/* Only show these sections after compilation is complete */}
        {!loading.compile && compiledJournal && (
          <>
            {/* Mood Section */}
            {loading.satisfaction || loading.keywords ? (
              <LoadingAnimation message="Analyzing mood..." />
            ) : (
              <View style={styles.moodSection}>
                <Pressable style={styles.button} onPress={() => { }}>
                  <Text style={styles.buttonText}>Mood</Text>
                </Pressable>
                <Text style={styles.moodEmoji}>{getEmoji(satisfactionScore)}</Text>
                <Text style={styles.moodDescription}>{keywords}</Text>
              </View>
            )}

            {/* Summary Section */}
            {loading.summary ? (
              <LoadingAnimation message="Generating summary..." />
            ) : (
              <View style={styles.summarySection}>
                <Pressable style={styles.button} onPress={() => { }}>
                  <Text style={styles.buttonText}>Summary</Text>
                </Pressable>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {/* Actions Section */}
            {loading.actions ? (
              <LoadingAnimation message="Loading recommended actions..." />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : actions?.recommendedActions ? (
              <>
                <Text style={styles.sectionTitle}>Choose actions to add to your list</Text>
                {getActionsList().map((action, index) => {
                  const isAdded = addedActions.has(action);
                  return (
                    <View key={index} style={styles.actionRow}>
                      <View style={[
                        styles.textContainer,
                        isAdded && styles.addedTextContainer
                      ]}>
                        <Text style={[
                          styles.actionText,
                          isAdded && styles.addedActionText
                        ]}>
                          {action}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          isAdded && styles.addedButton
                        ]}
                        onPress={() => handleAddTask(action)}
                        disabled={isAdded}
                      >
                        <Text style={[
                          styles.addButtonText,
                          isAdded && styles.addedButtonText
                        ]}>
                          {isAdded ? '✓' : '+'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </>
            ) : (
              <Text style={styles.noActionsText}>No actions available</Text>
            )}


            <Pressable style={styles.button} onPress={handleCompleteSession}>
              <Text style={styles.buttonText}>Complete Session</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleRestartSession}>
              <Text style={styles.buttonText}>Restart Session</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF0",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FAFAF0",
    padding: 20,
    width: "100%",
    borderRadius: 20,
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderWidth: 0.5,
  },
  date: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "200",
    fontFamily: "Inter-ExtraLight",
    color: "#000",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    marginBottom: 15,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  body: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
  },
  moodSection: {
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    fontFamily: "Inter-Medium",
  },
  moodEmoji: {
    fontSize: 50,
  },
  moodDescription: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    marginTop: 5,
  },
  summarySection: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center", // Center children horizontally
    justifyContent: "center",
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
  },
  actionsSection: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#FAFAF0",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#b6b6b6",
    padding: 10,
    marginVertical: 5,
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },
  button: {
    backgroundColor: "#474d41",
    borderRadius: 7,
    height: 60, // Fixed height
    width: 150, // Fixed width
    paddingVertical: 10, // Padding inside the button
    paddingHorizontal: 20, // Padding inside the button
    margin: 15, // Margin outside the button
    alignItems: "center",
    justifyContent: "center", // Center the text vertically
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    textAlign: "center", // Center the text horizontally
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  titleContainer: {
    minHeight: 50,  // Adjust this value based on your needs
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#FAFAF0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#FAFAF0",
    borderRadius: 8,
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
  },
  addButtonText: {
    fontSize: 20,
    backgroundColor: "#FAFAF0",
    fontWeight: "bold",

  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#474d41",
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  noActionsText: {
    color: '#807d7d',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  editButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#474d41",
    borderRadius: 7,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  editInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  addedTextContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  addedActionText: {
    color: '#999',
  },
  addedButton: {
    backgroundColor: '#e8e8e8',
    borderColor: '#ddd',
  },
  addedButtonText: {
    color: '#4CAF50',
  },
});

export default AnalyseJournal;
