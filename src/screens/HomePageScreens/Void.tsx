import React from "react";
import { StyleSheet, Text, View } from "react-native";

const VoidScreen = () => {
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

export default VoidScreen;
