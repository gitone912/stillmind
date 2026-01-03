import * as React from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator, TextInput, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { initiateUserSignup, verifyUserOTP } from "../store/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyOTP = ({ route, navigation }: any) => {
    const { email, password } = route.params || {};
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state: { auth: any; }) => state.auth);
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const inputRefs = React.useRef<Array<TextInput | null>>([]);

    React.useEffect(() => {
        sendOTP();
    }, []);

    const sendOTP = async () => {
        try {
            await dispatch(initiateUserSignup({ email })).unwrap();
        } catch (error) {
            Alert.alert("Error", "Failed to send OTP");
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // If last digit entered, verify OTP
        if (index === 5 && value) {
            verifyUserOtpHandler(newOtp.join(''));
        }
    };

    const verifyUserOtpHandler = async (otpString: string) => {
        try {
            await dispatch(verifyUserOTP({ email, password, otp: otpString })).unwrap();
            setShowSuccess(true);
            // Wait 2 seconds before navigating
            setTimeout(() => {
                navigation.replace('HIW');
            }, 1000);
        } catch (error: any) {
            Alert.alert("Error", error);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    if (showSuccess) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#474d41" />
                <Text style={styles.loadingText}>Registration Successful!</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#474d41" />
                <Text style={styles.loadingText}>Sending OTP...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={ref => inputRefs.current[index] = ref}
                        style={styles.otpBox}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                    />
                ))}
            </View>
            <Text style={styles.description}>
                We've sent a code to your email. Please enter it here to confirm.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfaf0",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32, // Space on left and right of the screen
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SF Pro",
        color: "#000",
        textAlign: "center",
        marginBottom: 40, // Space between title and OTP boxes
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 40, // Space between OTP boxes and description
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600',
        color: '#474d41',
        fontFamily: 'SF Pro',
    },
    otpBox: {
        width: 45,
        height: 45,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#d7d7d7',
        textAlign: 'center',
        fontSize: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: "Inter-Regular",
        color: "#797979",
        textAlign: "center",
    },
});

export default VerifyOTP;
