import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { usePoints } from '../hooks/usePoints';

const Header: React.FC = () => {
  const points = usePoints();

  return (
    <View style={styles.header}>
      <View style={styles.pointsContainer}>
        <Image source={require('../assets/leaf.png')} style={styles.leafIcon} />
        <Text style={styles.points}>{points}</Text>
      </View>
      <View style={styles.icons}>
        <Image source={require('../assets/chat.png')} style={styles.icon} />
        <Image source={require('../assets/bell.png')} style={styles.icon} />
        <Image source={require('../assets/profile.png')} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FCFAF0',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  points: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#979797",
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
    resizeMode: 'contain',
  },
});

export default Header;
