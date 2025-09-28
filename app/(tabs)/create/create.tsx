import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native-gesture-handler";
import ScrollerContainer from "../../(starter)/ScrollerContainer";
import CustomButton from "../../components/customButton";
import ToggleButton from "../../components/ToggleButton";
import FoodAdderHeader from "./FoodAdderHeader";
import MeasurementInput from "./measurments/MeasurementInput";
import SwitchableMeasurementInput from "./measurments/SwitchableMeasurementInput";
import ProfileButton from "@/app/components/profileButton";
import icons from "@/app/constants/icons";
import Constants from "expo-constants";
import { Post } from "@/app/services/api";
import LoadingComponent from "@/app/components/loadingComponent";
import animations from "@/app/constants/animations";
import LottieView from "lottie-react-native";
import { TabsContext } from "@/app/context/TabsProvider";
import { notificationContext } from "@/app/context/NotificationProvider";
import VerticalLine from "@/app/components/VerticalLine";
import { blue } from "react-native-reanimated/lib/typescript/Colors";
import ImageGetter from "./ImageGetter";
const { width, height } = Dimensions.get("window");

const { API_URL } = Constants.expoConfig?.extra;
const Create = () => {
  const [mode, setMode] = useState<boolean>(true);
  const [foodName, setFoodName] = useState<string>("");
  const [kcal, setKcal] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [portion, setPortion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [measure, setMeasure] = useState<string>("g/ml");
  const [loading, setLoading] = useState<boolean>(false);
  const [doneStatus, setDoneStatus] = useState<boolean>(false);
  const descAnimation = useRef(new Animated.Value(200)).current;
  const descPadAnimation = useRef(new Animated.Value(30)).current;
  const TabSettings = useContext(TabsContext);

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
  function handleDescription(value: string) {
    setDescription(value);
  }
  function cleanUpInput() {
    setPortion("");
    setDescription("");
    setFoodName("");
    setProtein("");
    setCarbs("");
    setKcal("");
  }
  async function submit() {
    setLoading(true);
    console.log("**************************************kcal");
    console.log(kcal);
    console.log(parseFloat(kcal));
    const res = await Post(API_URL + "/foods/create", {
      kcal: parseFloat(kcal),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      name: foodName,
      description: mode ? description : null,
      portion:
        measure == "g/ml" ? parseFloat(portion) : parseFloat(portion) * 1000,
    });
    if (res.ok === 1) {
      ///ok
      setDoneStatus(true);
      setTimeout(() => {
        setDoneStatus(false);
      }, 1200);
      TabSettings.setFoodUpdate((prev: boolean) => !prev);
      NotificationSettings.notify(res.message, 0);
      cleanUpInput();
    } else {
      console.log("error");
      NotificationSettings.notify(res.message, 2);
    }
    setLoading(false);
    console.log(res);
  }
  useEffect(() => {
    console.log(mode);
    if (mode) {
      Animated.timing(descAnimation, {
        useNativeDriver: false,
        duration: 200,
        toValue: 200,
      }).start();
      Animated.timing(descPadAnimation, {
        useNativeDriver: false,
        duration: 200,
        toValue: 30,
      }).start();
    } else {
      Animated.timing(descAnimation, {
        useNativeDriver: false,
        duration: 200,
        toValue: 0,
      }).start();
      Animated.timing(descPadAnimation, {
        useNativeDriver: false,
        duration: 200,
        toValue: 0,
      }).start();
    }
  }, [mode]);
  return (
    <Pressable onPress={Keyboard.dismiss}>
      {loading && (
        <LoadingComponent text={"Hold On A Second"} loading={loading} />
      )}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ alignContent: "center", alignItems: "center" }}
      >
        <FoodAdderHeader setMode={setMode} mode={mode} />
        <View
          style={{
            width: "90%",
            paddingVertical: 50,
            height: 150,
            backgroundColor: "white",
          }}
        >
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

        <Animated.View
          style={{
            width: "100%",
            paddingVertical: descPadAnimation,
            paddingInline: 15,
            maxHeight: descAnimation,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
              height: "100%",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "45%",
                backgroundColor: "white",
              }}
            >
              <Text
                style={{
                  marginBottom: 10,
                }}
              >
                Description (Optional)
              </Text>
              <TextInput
                style={{ ...styles.input, height: 80, maxWidth: "90%" }}
                keyboardType="default"
                placeholder="Italien dish composed of Macaroni and meat-tomato sauce (Bolognese style)"
                onChangeText={handleDescription}
                value={description}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "10%",
                backgroundColor: "white",
              }}
            >
              <VerticalLine
                width={2}
                height={"100%"}
                color="gray"
                marginInline={0}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "45%",
                backgroundColor: "white",
              }}
            >
              <ImageGetter
                setKcal={setKcal}
                setFoodName={setFoodName}
                setProtein={setProtein}
                setCarbs={setCarbs}
                setLoading={setLoading}
                setPortion={setPortion}
              />
            </View>
          </View>
        </Animated.View>
        <View style={{ ...styles.row, width: "90%" }}>
          <View style={styles.column}>
            <Text>Calories</Text>

            <MeasurementInput
              color="white"
              measure="Kcal"
              measurement={kcal}
              setMeasurement={setKcal}
            />
          </View>
          <View style={styles.column}>
            <Text>Protein</Text>
            <MeasurementInput
              color="white"
              measure="g"
              measurement={protein}
              setMeasurement={setProtein}
            />
          </View>
          <View style={styles.column}>
            <Text>Carbs</Text>
            <MeasurementInput
              color="white"
              measure="g"
              measurement={carbs}
              setMeasurement={setCarbs}
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
          <CustomButton style={submissionStyle} title="Add" onPress={submit} />
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

export default Create;

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
    height: 150,
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
  scrollContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
});
