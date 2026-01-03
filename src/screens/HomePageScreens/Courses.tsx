import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CoursesScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.comingSoonOverlay}>
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
        <Text style={styles.comingSoonSubtext}>We're working on something amazing!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fcfaf0",
      alignItems: "center",
      paddingTop: 80,
    },
    title: {
      fontSize: 30,
      fontFamily: "Ovo",
      color: "#000",
      marginBottom: 20,
    },
    leafIcon: {
      width: 20,
      height: 20,
      marginRight: 5,
      resizeMode: 'contain',
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: "#979797",
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 40,
    },
    optionContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    button: {
      width: 213,
      height: 79,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    aiButton: {
      backgroundColor: "#1878d1",
    },
    humanButton: {
      backgroundColor: "#41ad49",
    },
    buttonText: {
      fontSize: 20,
      fontFamily: "Inter-Regular",
      color: "#fff",
    },
    costContainer: {
      width: 79,
      height: 79,
      borderRadius: 10,
      borderWidth: 0.5,
      flexDirection: 'row',
      borderColor: "#b6b6b6",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    costText: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: "#777",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: "#777",
    },
    blurredContent: {
      opacity: 0.5,
      width: '100%',
      alignItems: 'center',
    },
    comingSoonOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(252, 250, 240, 0.7)',
    },
    comingSoonText: {
      fontSize: 40,
      fontFamily: 'Ovo',
      color: '#777',
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 50
    },
    comingSoonSubtext: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: '#777',
      textAlign: 'center',
    },
  });

export default CoursesScreen;
