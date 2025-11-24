import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StepperContext } from "./StepperProvider";
import axios from "axios";
import { Post } from "../services/api";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig?.extra;

interface AuthContextSettingsInterface {
  user?: any;
  setUser: any;
  userToken: any;
  setUserToken: any;
  login?: any;
  logout?: any;
}
const AuthContext = createContext<AuthContextSettingsInterface>({
  user: null,
  setUser: null,
  userToken: null,
  setUserToken: null,
  login: null,
  logout: null,
});

// headers: { Authorization: userToken }
interface AuthContextInterface {
  children: any;
}

const AuthProvider = (props: AuthContextInterface) => {
  const [userToken, setUserToken] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const StepperSettings = useContext(StepperContext);
  async function testToken() {
    console.log("testing");
    const res = await Post(API_URL + "/auth/validate", {});
    console.log(res);
    return res.ok == 1;
  }
  async function initilizer() {
    const localUser = await AsyncStorage.getItem("user");
    const localUserToken = await AsyncStorage.getItem("userToken");
    console.log(localUser);
    console.log("localUserToken");
    console.log(localUserToken);
    //test token validity
    setUser(JSON.parse(localUser));
    setUserToken(localUserToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${localUserToken}`;
    const validation = await testToken();

    if (!validation) {
      await logout();
    }
    //in case didnt start stupper and restarted app
    if (JSON.parse(localUser)) {
      StepperSettings.setStepper(JSON.parse(localUser).stepper);
    }
  }
  useEffect(() => {
    /*azdaz*/
    initilizer();
  }, []);

  async function saveToken(token: any, user: any) {
    if (!token) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");
      return;
    } else {
      console.log(user);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    }
  }

  async function clearStorage() {
    await AsyncStorage.clear();
  }

  async function login(userParam: object, token: string) {
    try {
      //saves asyncstorage
      await saveToken(token, userParam);
      //save localdate for auto reset
      await AsyncStorage.setItem("currentDate", userParam.userLastReset);
      console.log("saved time");
      //saves locally
      setUser(userParam);
      setUserToken(token);
      if (userParam) StepperSettings.setStepper(userParam.stepper);

      router.push("/(tabs)/create/create");
    } catch (e) {
      console.log(e.message + " " + e.stack);
    }
  }
  async function logout() {
    console.log("logout");
    await saveToken(null, null);
    await clearStorage();
    setUser(null);
    setUserToken(null);
    router.push("/");
  }
  useEffect(() => {
    console.log("user toekn changed");
    console.log(userToken);
  }, [userToken]);
  /*
  useEffect(() => {
    //45
    console.log("userToken");
    console.log(userToken);
    if (!userToken) {
      //logged out or expired

      //delete token and user
      console.log("signed nullified");
      saveToken(null, null);
      //clear the rest of attributes
      clearStorage();
      router.push("/");
    } else {
      //logged in
      console.log("signed************************************************");
      saveToken(userToken, user);
      if (user) StepperSettings.setStepper(user.stepper);
      router.push("/(tabs)/create");
    }
  }, [userToken]);
  useEffect(() => {
    if (user && userToken) {
      saveToken(userToken, user);
    }
  }, [user]);*/

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        userToken: userToken,
        setUserToken: setUserToken,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});
export { AuthContext, AuthProvider };
