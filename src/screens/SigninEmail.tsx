import * as React from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signin } from "../store/slices/authSlice";

const SignInEmail = ({ navigation }: any) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state: { auth: any; }) => state.auth);

  React.useEffect(() => {
    if (error && error !== "User not found") {  // Only show alert for non-navigation errors
      Alert.alert("Error", error);
    }
    if (error === "User not found") {
      navigation.replace('VerifyOTP', { email, password });
    }
  }, [error]);

  React.useEffect(() => {
    if (user) {
      navigation.navigate("Main")
      // navigation.navigate("HIW")
    }
  }, [user]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await dispatch(signin({ email, password })).unwrap();
    } catch (err) {
      console.log('Signin error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your email</Text>
      <TextInput
        style={styles.input}
        placeholder="newuser@stillmind.com"
        placeholderTextColor="#d7d7d7"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Enter your password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#d7d7d7"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#d7d7d7"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign in / Sign up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingHorizontal: 30, // Added horizontal padding
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600", // Made text bolder (was 600)
    color: "#000",
    marginBottom: 8,
    fontFamily: "SF Pro",
    textAlign: "left",
  },
  input: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "SF Pro",
    color: "#000",
  },
  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#474d41",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700", // Made text bolder (was 600)
    fontFamily: "SF Pro",
  },
});

export default SignInEmail;
