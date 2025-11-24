import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Verification from "./verification";
import Reset from "./reset";
import Email from "./email";

const AuthLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator>
            <Stack.Screen
              component={SignIn}
              name="sign-in"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={SignUp}
              name="sign-up"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Verification}
              name="verification"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Reset}
              name="reset"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Email}
              name="email"
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
