import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Get, Post } from "@/app/services/api";
import Constants from "expo-constants";
import Icon from "@/app/components/Icon";
import { Ionicons } from "@expo/vector-icons";

import { Dropdown } from "react-native-element-dropdown";
import { notificationContext } from "@/app/context/NotificationProvider";
import CustomButton from "@/app/components/customButton";
import Slider from "@react-native-community/slider";
import { AuthContext } from "@/app/context/AuthProvider";
import TosBlock from "../(profile)/TosBlock";
import icons from "@/app/constants/icons";
import { goalsEmitter } from "@/app/services/emitter";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const exerciseData = [
  { label: "Little/no exercise", value: 0, icon: "body-outline" },
  {
    label: "Light exercise/sports 1–3 days/week",
    value: 1,
    icon: "walk-outline",
  },
  { label: "Moderate exercise 3–5 days/week", value: 2, icon: "walk-outline" },
  { label: "Hard exercise 6–7 days/week", value: 3, icon: "flame-outline" },
  {
    label: "Very hard training / physical job",
    value: 4,
    icon: "flame-outline",
  },
];
const { API_URL } = Constants.expoConfig?.extra;
const CarbsTab = () => {
  const [carbsGoal, setCarbsGoal] = useState<number>(1000);
  const [caloriesGoal, setCaloriesGoal] = useState<number>(1000);
  const [proteinGoal, setProteinGoal] = useState<number>(1000);
  const [exerciceFreq, setExerciceFreq] = useState<number>(0);
  const [gotResults, setGotResults] = useState<boolean>(false);
  const [estimation, setEstimation] = useState<number>(0);
  const [fatEstimation, setfatEstimation] = useState<number>(0);
  const [weightGoal, setWeightGoal] = useState<number>(1);

  const [gender, setGender] = useState<boolean>(false);
  const NotificationSettings = useContext(notificationContext);
  const AuthSettings = useContext(AuthContext);

  const AFConverter: object = {
    0: 1.2,
    1: 1.375,
    2: 1.55,
    3: 1.725,
    4: 1.9,
  };
  const fetchGoals = async () => {
    const res = await Get(API_URL + "/macros/read", {});
    if (res.ok === 1) {
      setCarbsGoal(res.data.carbs_goal);
      setProteinGoal(res.data.protein_goal);
      setCaloriesGoal(res.data.calories_goal);
      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify(res.message, 2);
    }
  };
  useEffect(() => {
    fetchGoals();
  }, []);
  const SpecificIcon = ({ focused, icon, size, color, name }) => {
    return (
      <View style={styles.icon}>
        <Ionicons name={icon} size={size} color={color} />
        <Text style={focused ? styles.foctext : styles.text}>{name}</Text>
      </View>
    );
  };
  const submissionStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: "#2860E9",
    width: "70%",
    minHeight: 20,
    borderRadius: 7,
    margin: 10,
    padding: 10,
    opacity: 1,
  };

  const optionStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: "#2860E9",
    width: "33%",
    minHeight: 20,
    borderRadius: 7,
    margin: 10,
    padding: 10,
    opacity: 1,
  };

  async function estimate() {
    console.log("here");
    await fetchGoals();
    console.log("here");
    const user = AuthSettings.user;
    if (!user) return;
    const proteinCalories = proteinGoal * 4;
    let fatCalories = 0;
    if (weightGoal == 2 || weightGoal == 1) {
      //gain or maintain 30%
      fatCalories = 0.3 * caloriesGoal;
    } else {
      //loss
      fatCalories = 0.25 * caloriesGoal;
    }
    console.log(weightGoal);
    console.log(caloriesGoal);
    console.log(proteinGoal);
    console.log(fatCalories);
    const rest = caloriesGoal - fatCalories - proteinCalories;
    const carbs = rest / 4;
    console.log(carbs);
    setEstimation(Math.max(carbs, 0));
    setfatEstimation(fatCalories / 9);
    setGotResults(true);
  }

  async function save() {
    const res = await Post(API_URL + "/macros/update_carbs_goal", {
      carbs: estimation,
    });
    if (res.ok === 1) {
      setCarbsGoal(estimation);
      goalsEmitter.emit("newGoal", {});
      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify(res.message, 2);
    }
  }
  useEffect(() => {
    setGotResults(false);
  }, [weightGoal, exerciceFreq]);
  return (
    <ScrollView
      style={{
        height: screenHeight - 120,
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, marginTop: "50" }}>My Carbs Goal</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <Text
          style={{
            alignItems: "center",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          {carbsGoal.toFixed(2)}
          <Text style={{ fontWeight: "bold" }}> g</Text>
        </Text>
        <SpecificIcon
          icon="flame"
          name=""
          color={"red"}
          focused={true}
          size={50}
        />
      </View>
      <TosBlock
        title="Before You Start"
        content="Ensure your daily calories and protein are set for accurate carb and fat calculations."
        icon={icons.warning}
      />
      <Text>Nutrition Goals</Text>
      <View style={{ flexDirection: "column", margin: 10 }}>
        <TouchableOpacity
          onPress={() => {
            setGotResults(false);
            setWeightGoal(0);
          }}
          style={{
            marginVertical: 5,
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 15,
            borderWidth: 1,
            padding: 5,
            borderColor: weightGoal == 0 ? "#42f560" : "black",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: weightGoal == 0 ? "#42f560" : "black",
            }}
          >
            Lose fat (Cutting)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setGotResults(false);
            setWeightGoal(1);
          }}
          style={{
            marginVertical: 5,
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 15,
            borderWidth: 1,
            padding: 5,
            borderColor: weightGoal == 1 ? "#42f560" : "black",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: weightGoal == 1 ? "#42f560" : "black",
            }}
          >
            Maintain Weight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setGotResults(false);
            setWeightGoal(2);
          }}
          style={{
            marginVertical: 5,
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 15,
            borderWidth: 1,
            padding: 5,
            borderColor: weightGoal == 2 ? "#42f560" : "black",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: weightGoal == 2 ? "#42f560" : "black",
            }}
          >
            Gain muscle (bulking)
          </Text>
        </TouchableOpacity>
      </View>

      <CustomButton
        style={submissionStyle}
        title="Estimate My Carbs"
        onPress={estimate}
      />

      {gotResults && (
        <>
          <Text>Estimated Fat</Text>
          <Text style={{ height: 70 }}>{fatEstimation.toFixed(2)} g</Text>

          <Text>Estimated Carbs</Text>

          <Text style={{ height: 70 }}>{estimation.toFixed(2)} g</Text>
          <CustomButton
            style={{ ...submissionStyle, margin: "auto" }}
            title="Save As A New Goal"
            onPress={() => save()}
          />
        </>
      )}
    </ScrollView>
  );
};

export default CarbsTab;

const styles = StyleSheet.create({
  placeholder: {
    color: "dark-gray",
    fontSize: 14,
  },
  selectedText: {
    color: "black",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  itemText: {
    color: "gray",
    fontSize: 14,
  },
  icon: {
    height: "100%",
    alignItems: "center",
    flexDirection: "column",
  },
  text: {
    fontFamily: "sans-serif",
    fontSize: 10,
    margin: 0,
    width: "100%",
    color: "#0b0909",
    fontWeight: "bold",
  },
  foctext: {
    fontFamily: "sans-serif",
    fontSize: 10,
    margin: 0,
    width: "100%",
    color: "#46f28b",
    fontWeight: "bold",
  },
});
