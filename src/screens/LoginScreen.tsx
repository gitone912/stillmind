import React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useAppSelector } from "../store/hooks";

const LoginPage = ({ navigation }: any) => {
  const { user } = useAppSelector((state: { auth: any; }) => state.auth);

  React.useEffect(() => {
    if (user) {
      if (!user.is_onboarded) {
        navigation.navigate("HIW1");
      } else {
        navigation.navigate("Main");
      }
    }
  }, [user]);

  return (
    <View style={styles.loginPage}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require("../assets/logo_leaf.png")}
        resizeMode="contain"
      />

      {/* Title and Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Login or sign up</Text>
        <Text style={styles.subtitle}>
          Please select your preferred method{"\n"}to continue setting up your account
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => navigation.replace("SigninEmail")}
        >
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If you are creating a new account,{" "}
          <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text> will apply.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 40,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#1a1c29",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#797979",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center"
  },
  emailButton: {
    backgroundColor: "#474d41",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  emailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SF Pro",
  },
  footer: {
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "SF Pro",
    textAlign: "center",
    color: "#797979",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#1a1c29",
  },
});

export default LoginPage;
