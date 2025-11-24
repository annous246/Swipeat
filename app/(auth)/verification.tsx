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
const Verification = () => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const ref4 = useRef<any>(null);
  const ref5 = useRef<any>(null);
  const ref6 = useRef<any>(null);
  let [cachedEmail, setCachedEmail] = useState<string | null>(null);

  const NotificationSettings = useContext(notificationContext);
  useEffect(() => {
    //security check
    const init = async () => {
      const te = await AsyncStorage.getItem("temp_email");
      setCachedEmail(te);
      // if (!cachedEmail) {
      //   //not authorized here
      //   router.push("/");
      // }
    };
    init();
  }, []);
  function handlePress() {
    console.log("first");
    router.push("/(auth)/sign-in");
  }

  async function verify() {
    console.log(cachedEmail, digits.join(""));
    const res: any = await Post(API_URL + "/auth/verify", {
      email: cachedEmail,
      code: digits.join(""),
    });

    if (res.ok == 1) {
      //verified succ -> proceede to login
      router.push("/(auth)/sign-in");
      AsyncStorage.clear();
      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify(res.message, 2);
    }
  }

  async function resend() {
    //go back to backend TODO
    console.log(API_URL + "/resend");
    const res: any = await Post(API_URL + "/auth/resend", {
      email: cachedEmail,
    });
    if (res.ok) {
      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify(res.message, 1);
    }
  }
  function handleChange(input: string, field: number) {
    const refs = [ref1, ref2, ref3, ref4, ref5, ref6];
    console.log(refs[field].current);
    setDigits((prev: string[]) => {
      let newer: string[] = [...prev];
      newer[field] = input.length ? input[input.length - 1] : "";

      return newer;
    });
    if (input.length) {
      if (field < 5) refs[field + 1].current.focus();

      refs[field].current.blur();
    }
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
        Verification
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
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <TextInput
          style={styles.input}
          ref={ref1}
          keyboardType="numeric"
          value={digits[0]}
          onChangeText={(input) => handleChange(input, 0)}
        />
        <TextInput
          style={styles.input}
          ref={ref2}
          keyboardType="numeric"
          value={digits[1]}
          onChangeText={(input) => handleChange(input, 1)}
        />
        <TextInput
          style={styles.input}
          ref={ref3}
          keyboardType="numeric"
          value={digits[2]}
          onChangeText={(input) => handleChange(input, 2)}
        />
        <TextInput
          style={styles.input}
          ref={ref4}
          keyboardType="numeric"
          value={digits[3]}
          onChangeText={(input) => handleChange(input, 3)}
        />
        <TextInput
          style={styles.input}
          ref={ref5}
          keyboardType="numeric"
          value={digits[4]}
          onChangeText={(input) => handleChange(input, 4)}
        />
        <TextInput
          style={styles.input}
          ref={ref6}
          keyboardType="numeric"
          value={digits[5]}
          onChangeText={(input) => handleChange(input, 5)}
        />
      </View>
      <TouchableOpacity
        onPress={resend}
        style={{
          borderRadius: 5,
          paddingTop: 2,
          paddingBottom: 2,
          width: 100,
          backgroundColor: "#ffc23dff",
          alignSelf: "center",
          height: 40,
          alignContent: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>resend</Text>
      </TouchableOpacity>
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
        <Text style={{ textAlign: "center", color: "white" }}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
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
