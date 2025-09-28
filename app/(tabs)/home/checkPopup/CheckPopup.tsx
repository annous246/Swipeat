import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import "react-native-get-random-values";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native-gesture-handler";
import ScrollerContainer from "../../../(starter)/ScrollerContainer";
import CustomButton from "../../../components/customButton";
import ToggleButton from "../../../components/ToggleButton";
import ProfileButton from "@/app/components/profileButton";
import icons from "@/app/constants/icons";
import Constants from "expo-constants";
import { Post } from "@/app/services/api";
import LoadingComponent from "@/app/components/loadingComponent";
import animations from "@/app/constants/animations";
import LottieView from "lottie-react-native";
import { TabsContext } from "@/app/context/TabsProvider";
import { notificationContext } from "@/app/context/NotificationProvider";
import MeasurementInput from "../../create/measurments/MeasurementInput";
import SwitchableMeasurementInput from "../../create/measurments/SwitchableMeasurementInput";
import { AuthContext } from "@/app/context/AuthProvider";

const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const { API_URL } = Constants.expoConfig?.extra;
interface checkPopupType {
  setCarbsProgress: any;
  setCaloriesProgress: any;
  setProteinProgress: any;
}
const CheckPopup = ({
  setCarbsProgress,
  setCaloriesProgress,
  setProteinProgress,
}: checkPopupType) => {
  const [foodName, setFoodName] = useState<string>("");
  const [kcal, setKcal] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [portion, setPortion] = useState<string>("");
  const [measure, setMeasure] = useState<string>("g/ml");
  const [loading, setLoading] = useState<boolean>(false);
  const [doneStatus, setDoneStatus] = useState<boolean>(false);
  const descAnimation = useRef(new Animated.Value(200)).current;
  const descPadAnimation = useRef(new Animated.Value(30)).current;
  const TabSettings = useContext(TabsContext);
  const AuthSettings = useContext(AuthContext);
  useEffect(() => {
    if (!TabSettings.closed) {
      //opened then get food props
      setKcal(TabSettings.instantKcal);
      setCarbs(TabSettings.instantCarbs);
      setProtein(TabSettings.instantProtein);
      setPortion(TabSettings.instantPortion);
      setFoodName(TabSettings.instantFoodName);
    }
  }, [TabSettings.closed]);
  const NotificationSettings = useContext(notificationContext);
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
  function handleFoodName(value: string) {
    setFoodName(value);
  }
  async function addMacros() {
    const ret = await Post(API_URL + "/progress/update_progress", {
      calories: TabSettings.instantKcal,
      protein: TabSettings.instantProtein,
      carbs: TabSettings.instantCarbs,
    });

    return ret;
  }
  //   async function addConsumed() {
  //     const ret = await Post(API_URL + "/foods/consumed/instantAdd", {
  //       servings: 1,
  //       id: uuidv4(),
  //       name: TabSettings.instantFoodName,
  //       kcal: TabSettings.instantKcal,
  //       protein: TabSettings.instantProtein,
  //       carbs: TabSettings.instantCarbs,
  //       portion: TabSettings.instantPortion,
  //       userid: AuthSettings.user.email,
  //     });

  //     return ret;
  //   }
  async function remove() {
    //add to macros
    const ret = await addMacros();
    const ret2 = { ok: 1, message: "" }; //await addConsumed();
    if (ret.ok === 1 && ret2.ok === 1) {
      setCaloriesProgress((prev: number) => prev + parseFloat(kcal));
      setCarbsProgress((prev: number) => prev + parseFloat(carbs));
      setProteinProgress((prev: number) => prev + parseFloat(protein));
    } else {
      if (ret.ok !== 1) {
        NotificationSettings.notify(ret.message, 2);
      }
      if (ret2.ok !== 1) {
        NotificationSettings.notify(ret2.message, 2);
      }
    }
  }
  async function submit() {
    await remove();
    TabSettings.setClosed(true);
  }
  function closeIt() {
    TabSettings.setClosed(true);
  }
  return (
    <Pressable
      style={{
        ...styles.mainContainer,
        display: TabSettings.closed ? "none" : "flex",
      }}
      onPress={Keyboard.dismiss}
    >
      {loading && (
        <LoadingComponent text={"Hold On A Second"} loading={loading} />
      )}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ alignContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            marginTop: 0,
            padding: 20,
            width: "100%",
            height: 120,
          }}
        >
          <CustomButton
            title="X"
            textStyle={{
              textAlign: "center",
              textVerticalAlign: "center",
              color: "rgb(59, 60, 61)",
            }}
            style={styles.exitButton}
            onPress={closeIt}
          />
          <Text
            style={{
              marginBottom: 10,
            }}
          >
            Food Name
          </Text>
          <TextInput
            style={{ ...styles.input, height: 50 }}
            keyboardType="default"
            placeholder="Bolognese Pasta"
            onChangeText={handleFoodName}
            value={foodName}
          />
        </View>

        <View style={{ ...styles.column2, width: "90%", padding: 0 }}>
          <View style={{ ...styles.column, margin: 0 }}>
            <Text>Calories</Text>

            <MeasurementInput
              color="white"
              measure="Kcal"
              measurement={kcal}
              setMeasurement={setKcal}
              style={{ width: "90%", margin: 0 }}
            />
          </View>
          <View style={styles.column}>
            <Text>Protein</Text>
            <MeasurementInput
              color="white"
              measure="g"
              measurement={protein}
              setMeasurement={setProtein}
              style={{ width: "90%", margin: 0 }}
            />
          </View>
          <View style={styles.column}>
            <Text>Carbs</Text>
            <MeasurementInput
              color="white"
              measure="g"
              measurement={carbs}
              setMeasurement={setCarbs}
              style={{ width: "90%", margin: 0 }}
            />
          </View>
        </View>
        <View style={{ ...styles.column, width: "80%" }}>
          <Text>Portion</Text>
          <SwitchableMeasurementInput
            color="white"
            measure={measure}
            measurement={portion}
            setMeasurement={setPortion}
            setMeasure={setMeasure}
          />
        </View>
        {!doneStatus ? (
          <CustomButton
            style={submissionStyle}
            title="Consume"
            onPress={submit}
            textStyle={{
              color: "white",
            }}
          />
        ) : (
          <View style={styles.verify}>
            <LottieView
              style={{
                width: "100%",
                height: "150%",
              }}
              autoPlay
              loop={false}
              source={animations.greenTick}
            ></LottieView>
          </View>
        )}
      </ScrollView>
    </Pressable>
  );
};

export default CheckPopup;

const styles = StyleSheet.create({
  verify: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: "#2860E9",
    width: "70%",
    height: 41,
    borderRadius: 7,
    margin: 10,
    opacity: 1,
    overflow: "hidden",
  },
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 150,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  column2: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
  },
  input: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 0.3,
    textAlign: "left",
    padding: 5,
  },
  toggle: {
    margin: "auto",
  },
  scrollContainer: {},
  mainContainer: {
    display: "flex",
    backgroundColor: "white",
    position: "absolute",
    top: screenHeight / 2 - screenHeight * 0.35,
    left: screenWidth / 2 - screenWidth * 0.4,
    zIndex: 200000,
    width: screenWidth * 0.8,
    height: screenHeight * 0.7,
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
    zIndex: 200005000,
  },
});
