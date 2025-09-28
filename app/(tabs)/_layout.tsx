import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import icons from "../constants/icons";
import { text } from "body-parser";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import Home from "./home/home";
import Profile from "./(profile)/_layout";
import Bookmark from "./bookmark/bookmark";
import Create from "./create/create";
import GaolsLayout from "./(goals)/_layout";
import Icon from "../components/Icon";
import Analytics from "./analytics/analytics";
import { useNavigationState } from "@react-navigation/native";
import SpecialButton from "./specialButton/SpecialButton";
const Tabs = createBottomTabNavigator();
const TabsLayout = () => {
  const state = useNavigationState((state) => state); // full navigation state
  const currentTabIndex = state.index; // index of active ta
  const currentTab = state.routes[0]["state"] ?? { index: 0 };
  useEffect(() => {
    console.log("currently");
    console.log(currentTab);
  }, [currentTab]);
  const NoComp = () => null;
  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "#46f28b",
          tabBarInactiveTintColor: "#CFB1B7",
          tabBarStyle: { backgroundColor: "white" },
        }}
      >
        <Tabs.Screen
          name="home"
          component={Home}
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="home"
                  name="Home"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          component={Bookmark}
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="fast-food"
                  name="Consumed"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="create"
          component={Create}
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="add-circle"
                  name="Add"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="instant"
          component={NoComp}
          options={{
            title: "Instant",
            headerShown: false,
            tabBarButton: (props) => (
              <SpecialButton {...props} tab={currentTab} />
            ),
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon={currentTab.index != 0 ? "camera-outline" : "camera"}
                  name="Instant"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          component={GaolsLayout}
          name="(goals)"
          options={{
            title: "Goals",
            headerShown: false,

            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="trophy"
                  name="Goals"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          component={Analytics}
          name="analytics"
          options={{
            title: "Analytics",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="analytics-outline"
                  name="Analytics"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="(profile)"
          component={Profile}
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="person"
                  name="Profile"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      </Tabs.Navigator>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: "100%",
  },
});
