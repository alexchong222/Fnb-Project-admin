import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from 'axios';


const Register = () => {
  const API_BASE_URL = 'http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/user';
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (inputText) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputText);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(validateEmail(text));
  };

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const navigation = useNavigation();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const handleRegisterPress = async () => {
    try {
      // Validate email and password before making the request
      if (!isValidEmail || password.trim() === "") {
        // Show an error message or handle invalid input
        return;
      }

      // Make a POST request to the registration endpoint
      const response = await axios.post(`${API_BASE_URL}`, {
        email: email,
        password: password,
      });

      // Handle the response
      console.log("Registration successful:", response.data);

      // Set the success state to true
      setRegistrationSuccess(true);

      // Optionally, you can reset the error state
      setRegistrationError(null);

      // Navigate to the next screen after a delay (for the user to see the success message)
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      // Handle the error
      console.error("Registration failed:", error.message);

      // Set the error state
      setRegistrationError(error.message);

      // Optionally, you can reset the success state
      setRegistrationSuccess(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text style={styles.inText}>Register</Text>
      <View style={styles.imgCont}>
        <Image
          style={{ width: 300, height: 300 }}
          source={require("./assets/splashscreen.jpg")}
        ></Image>
      </View>
      <View style={styles.inCont}>
      <MaterialCommunityIcons
          name="email"
          size={30}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Email Address"
          keyboardType="email-address"
          onChangeText={handleEmailChange}
          value={email}
        />
      </View>
      {!isValidEmail && (
        <Text style={styles.errorText}>Please enter a valid email address</Text>
      )}
      <View style={styles.inCont}>
        <MaterialCommunityIcons
          name="account-lock"
          size={30}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ flex: 0.97 }}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={30}
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
      {registrationSuccess && (
        <Text style={styles.successText}>Registration successful! Redirecting to Login Screen</Text>
      )}
      {registrationError && (
        <Text style={styles.errorText}>{registrationError}</Text>
      )}
      <TouchableOpacity 
      onPress={handleRegisterPress}
      style={{
        backgroundColor: "#AD40AF",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
      }}>
        <Text style={{ color: "white", textAlign: "center" }}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imgCont: {
    paddingTop: "5%",
    alignItems: "center",
    paddingBottom: "20%",
  },

  inCont: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 20,
  },

  inText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },

  successText: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Register;
