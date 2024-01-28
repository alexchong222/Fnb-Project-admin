import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from 'axios';

const Login = () => {
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

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const handleLoginPress = async () => {
    try {
      if (!isValidEmail) {
        console.log("Invalid email address");
        return;
      }
      if (!password.trim()) {
        console.log("Password is required");
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}`);
    const responseData = response.data;
    const foundUser = responseData.find(user => user.email === email && user.password === password);
    if (foundUser) {
      console.log("Login successful");
      setLoginSuccess(true);
      setLoginError(null);
      const userId = foundUser.userId; 
      console.log("User ID:", userId);
      setTimeout(() => {
        if (foundUser.userLevel === "1") {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' , params: { userId } }],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'CustomerHomePage' , params: { userId } }],
            })
          );
        }
      }, 2000);
    } else {
      console.log("Invalid email or password");
      setLoginSuccess(false);
      setLoginError("Invalid email or password");
    }
  } catch (error) {
      console.error("Login failed:", error.message);
      setLoginError(error.message);
      setLoginSuccess(false);
    }
  };  

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.inText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.imgCont}>
        <Image
          style={{ width: 300, height: 300 }}
          source={require("./assets/splashscreen.jpg")}
        />
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
      {loginSuccess && (
        <Text style={styles.successText}>Login successful!</Text>
      )}
      {loginError && (
        <Text style={styles.errorText}>{loginError}</Text>
      )}
      <TouchableOpacity
        onPress={handleLoginPress}
        style={{
          backgroundColor: "#AD40AF",
          padding: 20,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigateToRegister}
        style={{
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>
          Don't have an account? Register Now!
        </Text>
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

export default Login;
