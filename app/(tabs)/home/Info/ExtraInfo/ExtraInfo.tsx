import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import CustomButton from "@/app/components/customButton";
import icons from "@/app/constants/icons";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { alreadyDotted } from "@/app/utils/utils";
import NutritionFacts from "./NutritionFacts";
import { Colors } from "react-native/Libraries/NewAppScreen";
import EditableInfo from "./EditableInfo";
import { Post } from "@/app/services/api";
import LoadingComponent from "@/app/components/loadingComponent";
import Constants from "expo-constants";
import { foodType } from "@/app/types";
import { MotiView } from "moti";
import { notificationContext } from "@/app/context/NotificationProvider";
const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get("window");

const { API_URL } = Constants.expoConfig?.extra;

const ExtraInfo = ({
  protein: protein,
  setCurrentFood: setCurrentFood,
  carbs: carbs,
  calories: calories,
  status: status,
  setStatus: setStatus,
  portion: portion,
  name: name,
  id: id,
}: {
  protein?: number;
  carbs?: number;
  calories?: number;
  portion?: number;
  status: boolean;
  setStatus: any;
  name?: string;
  id?: number;
  setCurrentFood: any;
}) => {
  //const displayValue = useRef(new Animated.Value(status ? 1 : 0)).current;
  const container = useRef(null);
  const [editable, setEditable] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPortion, setCurrentPortion] = useState<string>(
    portion ? portion.toString() : ""
  );
  const [currentProtein, setCurrentProtein] = useState<string>(
    protein ? protein.toString() : ""
  );
  const [currentCarbs, setCurrentCarbs] = useState<string>(
    carbs ? carbs.toString() : ""
  );
  const [currentCalories, setCurrentCalories] = useState<string>(
    calories ? calories.toString() : ""
  );
  const NotificationSettings = useContext(notificationContext);
  function isFullZero() {
    const fullString = (portion ?? 0.0).toFixed(15);
    console.log(fullString);

    let onlyZero = /^0\.0+$/.test(fullString);
    console.log(onlyZero);
    return onlyZero;
  }
  function getMultiplier(): number {
    if (isFullZero()) {
      return parseFloat(currentPortion) ?? 0.0;
    } else {
      console.log("second");
      console.log(currentPortion);
      console.log(parseFloat(currentPortion));
      return (
        parseFloat(currentPortion) / (portion ?? parseFloat(currentPortion))
      );
    }
  }
  function safeChoice(p: string): number {
    switch (p) {
      case "Calories":
        return calories ? calories : 0.0;
      case "Carbs":
        return carbs ? carbs : 0.0;
      case "Protein":
        return protein ? protein : 0.0;
    }
    return 0.0;
  }
  async function save() {
    setLoading(true);
    if (parseFloat(currentCalories) != calories) {
      //change
      const response = await Post(API_URL + "/foods/update/update_calories", {
        id: id,
        calories: parseFloat(currentCalories),
      });
      if (response.ok === 1) {
        setCurrentFood((prev: foodType) => {
          const newValue = parseFloat(currentCalories);
          console.log("newValue cabs");
          console.log(newValue);
          console.log(typeof newValue);
          console.log("newValue carbs ");
          return { ...prev, calories: newValue };
        });
        NotificationSettings.notify(response.message, 0);
      } else {
        console.log("error ", response.message);
        NotificationSettings.notify(response.message, 2);
      }
      console.log(response);
    }

    if (parseFloat(currentCarbs) != carbs) {
      //change
      const response = await Post(API_URL + "/foods/update/update_carbs", {
        id: id,
        carbs: parseFloat(currentCarbs),
      });
      if (response.ok === 1) {
        console.log("done");
        const newValue = parseFloat(currentCarbs);
        console.log("newValue");
        console.log(newValue);
        setCurrentFood((prev: foodType) => {
          return { ...prev, carbs: newValue };
        });
        NotificationSettings.notify(response.message, 0);
      } else {
        console.log("error ", response.message);
        NotificationSettings.notify(response.message, 2);
      }
      console.log(response);
    }

    if (parseFloat(currentProtein) != protein) {
      //change
      const response = await Post(API_URL + "/foods/update/update_protein", {
        id: id,
        protein: parseFloat(currentProtein),
      });
      if (response.ok === 1) {
        const newValue = parseFloat(currentProtein);
        setCurrentFood((prev: foodType) => {
          return { ...prev, protein: newValue };
        });
        NotificationSettings.notify(response.message, 0);
      } else {
        console.log("error ", response.message);
        NotificationSettings.notify(response.message, 2);
      }
      console.log(response);
    }
    if (parseFloat(currentPortion) != portion) {
      //change
      const response = await Post(API_URL + "/foods/update/update_portion", {
        id: id,
        portion: parseFloat(currentPortion ?? 0.0),
      });
      if (response.ok === 1) {
        //updating portions
        //auto update proportions front now

        const multiplier = getMultiplier();
        console.log(
          "mult********************************************************"
        );
        console.log(multiplier);
        console.log("safe");
        console.log(safeChoice("Calories"));
        console.log(safeChoice("Calories") * multiplier);
        const newCalories = JSON.stringify(safeChoice("Calories") * multiplier);

        const newCarbs = JSON.stringify(safeChoice("Carbs") * multiplier);

        const newProtein = JSON.stringify(safeChoice("Protein") * multiplier);

        console.log(multiplier);
        console.log(newCarbs);
        setCurrentCalories(newCalories);
        setCurrentCarbs(newCarbs);
        setCurrentProtein(newProtein);
        console.log("here *******");

        const newValue = parseFloat(currentPortion);
        setCurrentFood((prev: foodType) => {
          return {
            ...prev,
            portion: newValue,
            carbs: parseFloat(parseFloat(newCarbs).toFixed(2)),
            calories: parseFloat(parseFloat(newCalories).toFixed(2)),
            protein: parseFloat(parseFloat(newProtein).toFixed(2)),
          };
        });
        NotificationSettings.notify(response.message, 0);
      } else {
        console.log("error ", response.message);
        NotificationSettings.notify(response.message, 2);
      }
      console.log(response);
    }

    setLoading(false);
  }
  useEffect(() => {
    console.log("cals" + currentCalories);
  }, [currentCalories]);
  function handlePortion(input: string) {
    if (!input || !input.length) setCurrentPortion(input);
    if (
      isNaN(parseFloat(input)) ||
      parseFloat(input) < 0 ||
      alreadyDotted(input)
    )
      return;
    setCurrentPortion(input);
  }

  function close() {
    setStatus(false);
  }
  function editInfo() {
    setEditable((prev: boolean) => !prev);
  }
  useEffect(() => {
    console.log("extra");
    console.log(status);
  }, [status]);
  return (
    <MotiView
      from={{
        opacity: status ? 1 : 0,
        height: status ? ScreenHeight - 150 : 0,
      }}
      animate={{
        opacity: status ? 1 : 0,
        height: status ? ScreenHeight - 150 : 0,
      }}
      transition={{
        type: "timing",
        duration: 600,
      }}
      style={{
        ...styles.container,
        overflow: "hidden",
        width: ScreenWidth - 50,
        top: ScreenHeight / 2 - (ScreenHeight - 50) / 2, // height / 2 - (component height / 2)
        left: ScreenWidth / 2 - (ScreenWidth - 50) / 2,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={container}
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
        }}
        contentContainerStyle={{ justifyContent: "flex-start" }}
      >
        <LoadingComponent loading={loading} text="Saving Changes" />
        <View
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 10,
            overflow: "hidden",
            backgroundColor: "green",
            height: 150,
          }}
        >
          <ImageBackground
            source={icons.foodplaceholder}
            style={{ zIndex: -800, height: "100%" }}
            width={700}
          >
            <CustomButton
              title="X"
              textStyle={{
                textAlign: "center",
                textVerticalAlign: "center",
                color: "rgb(59, 60, 61)",
              }}
              style={styles.exitButton}
              onPress={close}
            />
            <Text style={styles.title}>{name}</Text>
          </ImageBackground>
        </View>
        <Text style={styles.smallText}>Portion Size (g)</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={currentPortion}
          onChangeText={handlePortion}
        />
        <Text
          style={{
            fontSize: 15,
            color: "rgb(87, 88, 89)",
            marginBottom: 20,
            marginTop: 30,
          }}
        >
          Nutrition Facts
        </Text>
        <NutritionFacts protein={protein} calories={calories} carbs={carbs} />
        <CustomButton
          textStyle={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            textVerticalAlign: "center",
          }}
          onPress={editInfo}
          style={{
            ...styles.submit,
            margin: 0,
            height: 30,
            backgroundColor: "transparent",
          }}
          currentIcon={icons.dropdown}
          iconStyle={{
            width: "60%",
            height: "60%",
            color: "red",
            tintColor: "black",
          }}
        />
        <EditableInfo
          status={editable}
          currentCalories={currentCalories}
          currentCarbs={currentCarbs}
          currentProtein={currentProtein}
          setCurrentCalories={setCurrentCalories}
          setCurrentCarbs={setCurrentCarbs}
          setCurrentProtein={setCurrentProtein}
        />
        <CustomButton
          textStyle={{
            textAlign: "center",
            color: "#4094f7",
            fontWeight: "bold",
            textVerticalAlign: "center",
          }}
          title="Save"
          onPress={save}
          style={{
            ...styles.submit,
            borderColor: "#4094f7",
            borderWidth: 1,
          }}
        />
      </ScrollView>
    </MotiView>
  );
};
export default ExtraInfo;

const styles = StyleSheet.create({
  submit: {
    backgroundColor: "white",
    color: "#4094f7",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    width: "80%",
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "center",
    height: "100%",
    color: "black",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    textAlignVertical: "center",
    backgroundColor: "white",
  },
  smallText: {
    color: "rgb(87, 88, 89)",
    fontSize: 12,
  },
  exitButton: {
    position: "absolute",
    borderRadius: 100,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgb(59, 60, 61)",
    width: 30,
    height: 30,
    marginRight: 1,
    marginTop: 1,
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  container: {
    position: "absolute",
    backgroundColor: "rgb(248, 248, 248)",
    zIndex: 100000,
    borderRadius: 15,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  animatedContainer: {
    position: "relative",
    backgroundColor: "#4094f7",
    zIndex: 10000,
    borderRadius: 15,
    height: "100%",
    width: "100%",
    padding: 10,
  },
  mainContainer: {
    position: "absolute",
    zIndex: 500,
    height: ScreenHeight,
    width: ScreenWidth,
  },
});
