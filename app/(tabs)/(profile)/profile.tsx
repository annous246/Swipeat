import {
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { AuthContext } from "../../context/AuthProvider";
import { ScrollView } from "react-native-gesture-handler";
import icons from "../../constants/icons";
import Spanner from "../../components/Spanner";
import Line from "../../components/Line";
import IntroPanel from "../../components/introPanel";
import ProfileButton from "../../components/profileButton";
import { notificationContext } from "@/app/context/NotificationProvider";
import NotificationBar from "@/app/components/NotificationBar";
import useAutoTimer from "@/app/hooks/useAutoTimer";
import ChatbotPanel from "./chatbotPanel/ChatbotPanel";
const { height: screenheight, width: screenWidth } = Dimensions.get("window");

const Profile = () => {
  const NotificationSettings = useContext(notificationContext);
  const [p, setP] = useState(false);
  const [close, setClose] = useState<boolean>(true);
  const [call, setCall] = useState(false);

  // useAutoTimer(() => {});
  function pop() {
    NotificationSettings.notify(
      "testtesttesttesttesttesttesttestesttetesttesttesttesttesttesttesttesttesttesttesttesttest",
      0
    );
    setCall((prev) => !prev);
    /*
    console.log("first");
    console.log(p);*/
  }
  useEffect(() => {}, [call]);
  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      {!close ? (
        <ChatbotPanel setClose={setClose} />
      ) : (
        <TouchableOpacity style={styles.ai} onPress={() => setClose(false)}>
          <Image
            source={icons.gemini}
            style={{ height: "50%", width: "50%" }}
          />
        </TouchableOpacity>
      )}

      <ScrollView style={styles.container}>
        <IntroPanel />

        <ProfileButton
          onPress={() => {
            router.push("/(tabs)/(profile)/settings");
          }}
          title="Settings"
          icon={icons.setting}
        />
        <ProfileButton
          onPress={() => {
            router.push("/(tabs)/(profile)/terms");
          }}
          title="Terms & Conditions"
          icon={icons.privacy}
        />
      </ScrollView>
    </Pressable>
  );
};

export default Profile;

const styles = StyleSheet.create({
  ai: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: screenWidth - 80,
    top: screenheight - 140,
    backgroundColor: "rgba(99, 96, 99, 1)",
    height: 60,
    zIndex: 10000,
    width: 60,
    borderRadius: 5000,
    overflow: "hidden",
  },
  container: {
    backgroundColor: "white",
    height: "100%",
  },
});
