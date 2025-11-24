import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import animations from "../constants/animations";
import icons from "../constants/icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post } from "../services/api";
import { notificationContext } from "../context/NotificationProvider";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig?.extra;
const Email = () => {
  let [cachedEmail, setCachedEmail] = useState<string>("");

  const NotificationSettings = useContext(notificationContext);

  function handlePress() {
    console.log("first");
    router.push("/(auth)/sign-in");
  }

  async function verify() {
    console.log(API_URL);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cachedEmail.length > 0 && regex.test(cachedEmail)) {
      //verified succ -> proceede to login

      await AsyncStorage.setItem("temp_email", cachedEmail);
      console.log(API_URL);
      const res = await Post(API_URL + "/auth/forgot", { email: cachedEmail });
      if (res.ok == 1 || res.ok == 2) {
        router.push("/(auth)/reset");
      }

      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify("Input Error", 2);
    }
  }

  function handleChange(input: string) {
    setCachedEmail(input);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.link} onPress={handlePress}>
        <View style={styles.buttonView}>
          <Image
            resizeMode="contain"
            source={icons.left}
            style={{ ...styles.backImage, tintColor: "black" }}
          ></Image>
        </View>
      </TouchableOpacity>
      <Text style={{ textAlign: "center", fontSize: 32, color: "#53976aff" }}>
        Email
      </Text>
      <LottieView
        style={{
          width: 300,
          height: 300,
          alignSelf: "center",
        }}
        autoPlay
        loop={false}
        source={animations.email}
      />
      <Text style={{ textAlign: "center", fontSize: 22, color: "#53976aff" }}>
        Your Account Email
      </Text>
      <TextInput style={styles.passWordinput} onChangeText={handleChange} />

      <TouchableOpacity
        onPress={verify}
        style={{
          borderRadius: 5,
          paddingTop: 2,
          paddingBottom: 2,
          width: 200,
          backgroundColor: "#3d98ffff",
          alignSelf: "center",
          height: 40,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Reset Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Email;

const styles = StyleSheet.create({
  passWordinput: {
    width: 200,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
    textAlignVertical: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  backImage: {
    width: "100%",
    height: "100%",
  },
  buttonView: {
    flex: 1,
    alignContent: "center",
    width: "60%",
    height: "60%",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignContent: "center",
    justifyContent: "flex-start",
    height: "100%",
    paddingTop: 40,
  },
  input: {
    marginLeft: 10,
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
    textAlignVertical: "center",
  },
  link: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    zIndex: 7000000,

    top: "5%",
    left: "5%",
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "black",
    overflow: "hidden",
  },
});
