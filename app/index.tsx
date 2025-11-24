import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import icons from "./constants/icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import animations from "./constants/animations";
import { AuthContext } from "./context/AuthProvider";
import LoadingComponent from "./components/loadingComponent";
const App = () => {
  const [logged, setLogged] = useState<Boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const AuthSettings = useContext(AuthContext);
  async function initilize() {
    const localToken = await AsyncStorage.getItem("userToken");
    setLogged(localToken != null);
    if (AuthSettings.userToken == null && localToken) {
      //defferential then load till equalized
      setLoading(true);
    }
    //8njknk
  }
  /*
  useEffect(() => {
    setLogged(AuthSettings.userToken != null);
  }, [AuthSettings.userToken]);
*/
  useEffect(() => {
    initilize();
  }, []);
  useEffect(() => {
    console.log("logged");
    console.log(logged);
  }, [logged]);
  useEffect(() => {
    console.log("loading");
    console.log(loading);
  }, [loading]);

  function handlePress() {
    router.push("/sign-in");
  }
  function handleSecondPress() {
    router.push("/sign-up");
  }
  const translate = useRef(new Animated.Value(-100)).current;
  const opacityIn = useRef(new Animated.Value(0)).current;
  const mainTitle = useRef<Text>(null);
  useEffect(() => {
    Animated.timing(translate, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityIn, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    //console.log("hi");
    // if (mainTitle.current ) console.log(mainTitle.current.validAttributes);
    // setTimeout(() => (mainTitle.current.props.style.opacity = 1));
  }, []);
  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{ height: "100%" }}
    >
      {logged && <LoadingComponent loading={loading} />}
      <View style={styles.appContainer}>
        {/*animated view*/}
        <Animated.View
          style={[styles.mainlogo, { transform: [{ translateY: translate }] }]}
        >
          <LottieView
            style={{
              marginTop: -100,
              marginBottom: 0,
              width: 300,
              height: 300,
            }}
            autoPlay
            loop={true}
            source={animations.food}
          />
          <Animated.Text
            ref={mainTitle}
            style={{ ...styles.logotext, opacity: opacityIn }}
          >
            Swipeat
          </Animated.Text>
        </Animated.View>
        {!logged ? (
          <>
            <TouchableOpacity
              onPress={handlePress}
              style={{ ...styles.button, marginBottom: 10 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Login With Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSecondPress} style={styles.button}>
              <Text style={{ color: "white", textAlign: "center" }}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button}>
            <Text style={{ color: "white", textAlign: "center" }}>
              Logged In
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default App;
///anass@gmail.com
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  logotext: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#f35d30",
    margin: "auto",
    marginTop: "0%",
    fontFamily: "sans-serif-thin",
  },
  logo: {
    alignSelf: "center",
    width: 200,
    height: 200,
  },
  text: {
    width: 100,
    height: 100,
  },
  mainlogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "50%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#f35d30",
    backgroundColor: "#f35d30",
    width: 200,
  },
});
