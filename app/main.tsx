import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import AuthLayout from "./(auth)/_layout";
import tabsLayout from "./(tabs)/_layout";
import Starter from "./(starter)/starter";
import index from "./index";
import create from "./(tabs)/create/create";
import TabsList from "../test playground/parent";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepperContext } from "./context/StepperProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home from "./(tabs)/home/home";
import Bookmark from "./(tabs)/bookmark/bookmark";
import profile from "./(tabs)/(profile)/_layout";
import Reset from "./(auth)/reset";

export default function Main() {
  const StepperSettings = useContext(StepperContext);
  const AuthSettings = useContext(AuthContext);
  const [started, setStarted] = useState<boolean>(!StepperSettings.stepper);
  const [isAuth, setIsAuth] = useState<Boolean>(
    AuthSettings.userToken ? true : false
  );

  const Stack = createNativeStackNavigator();
  useEffect(() => {
    console.log("change");
    console.log(AuthSettings.userToken);
    console.log(AuthSettings.user);
    setIsAuth(AuthSettings.userToken != null);
  }, [AuthSettings.userToken]);
  useEffect(() => {
    console.log("StepperSettings.stepper");
    console.log(StepperSettings.stepper);
    setStarted(!StepperSettings.stepper);
  }, [StepperSettings.stepper]);
  useEffect(() => {
    console.log("isAuth");
    console.log(isAuth);
  }, [isAuth]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator>
            {!isAuth ? (
              <>
                <Stack.Screen
                  name="index"
                  component={index}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  component={AuthLayout}
                  name="(auth)"
                  options={{ headerShown: false }}
                />
              </>
            ) : started ? (
              <Stack.Screen
                component={tabsLayout}
                name="(tabs)"
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                component={Starter}
                name="(starter)"
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
