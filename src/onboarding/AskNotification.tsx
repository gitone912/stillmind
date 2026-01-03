import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AskNotification = ({ navigation, route }: any) => {
  const { name } = route.params;
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectedTime, setSelectedTime] = React.useState("9:00 PM");
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${period}`;
      setSelectedTime(formattedTime);
    }
  };

  const printSelections = () => {
    // Convert short day names to full names
    const dayMap: { [key: string]: string } = {
      'S': 'Sunday',
      'M': 'Monday',
      'T': 'Tuesday',
      'W': 'Wednesday',
      'TH': 'Thursday',
      'F': 'Friday',
      'SA': 'Saturday'
    };

    const fullDays = selectedDays.map(day => dayMap[day]);
    navigation.replace("AskJournal", {
      name,
      notificationDays: fullDays,
      notificationTime: selectedTime
    });
  };

  const days = ["S", "M", "T", "W", "TH", "F", "SA"];

  return (
    <View style={[styles.container]}>
      <Text style={styles.heading}>{`Healthy habits are built\nthrough consistency.`}</Text>

      <View style={styles.notificationBox}>
        <Image style={styles.logo} source={require("../assets/mindnote-logo.png")} />
        <View>
          <Text style={styles.notificationTitle}>Mindleaf</Text>
          <Text style={styles.notificationMessage}>John, it's time to reflect about your day.</Text>
        </View>
      </View>

      <Text style={styles.subHeading}>Notify me on</Text>

      <View style={styles.daysContainer}>
  {days.map((day, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.dayCircle, selectedDays.includes(day) && styles.daySelected]}
      onPress={() => toggleDay(day)}
    >
      <Text
        style={[
          styles.dayText,
          selectedDays.includes(day) && { color: "#fff" }, // Change text color for selected days
        ]}
      >
        {day}
      </Text>
    </TouchableOpacity>
  ))}
</View>


      <Text style={styles.subHeading}>at</Text>

      <TouchableOpacity style={styles.timeBox} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.timeText}>{selectedTime}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      <Pressable style={styles.nextButton} onPress={printSelections}>
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    marginTop: 200,
    textAlign: "center",
    color: "#474d41",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    fontSize: 15,
  },
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  notificationMessage: {
    fontSize: 12,
    color: "#000",
  },
  subHeading: {
    marginTop: 20,
    fontSize: 15,
    color: "#474d41",
    fontFamily: "Inter-Regular",
  },
  daysContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  daySelected: {
    backgroundColor: "#474d41",
    borderColor: "#474d41",
  },
  dayText: {
    color: "#000",
  },
  timeBox: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 45,
  },
  timeText: {
    color: "#000",
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#474d41",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 45,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
  },
});

export default AskNotification;
