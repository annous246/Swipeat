import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollView } from "react-native-gesture-handler";
import HomeHeader from "./FoodComponents/HomeHeader";
import FoodComponent from "./FoodComponents/FoodComponent";
import { foodType, response } from "@/app/types";
import ExtraInfo from "./Info/ExtraInfo/ExtraInfo";
import { Get, Post } from "@/app/services/api";
import Constants from "expo-constants";
import LoadingComponent from "@/app/components/loadingComponent";
import icons from "@/app/constants/icons";
import { TabsContext } from "@/app/context/TabsProvider";
import Bookmark from "../bookmark/bookmark";
import Test from "./test";
import { notificationContext } from "@/app/context/NotificationProvider";
import { DateContext } from "@/app/context/DateProvider";
import CheckPopup from "./checkPopup/CheckPopup";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const { API_URL } = Constants.expoConfig?.extra;
const Home = () => {
  const [status, setStatus] = useState<boolean>(false);
  const [removalAnimate, setRemovalAnimate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [animatedStatus, setAnimatedStatus] = useState<boolean>(false);
  const [currentFood, setCurrentFood] = useState<foodType | null>(null);
  const [foodList, setFoodList] = useState<foodType[]>([]);
  const [caloriesProgress, setCaloriesProgress] = useState<number>(0);
  const [proteinProgress, setProteinProgress] = useState<number>(0);
  const [carbsProgress, setCarbsProgress] = useState<number>(0);

  const [FoodDisplay, setFoodDisplay] = useState<boolean>(true);

  const NotificationSettings = useContext(notificationContext);
  const TabsSettings = useContext(TabsContext);
  const DateSettings = useContext(DateContext);
  async function getProgress() {
    console.log("progress");
    const res = await Get(API_URL + "/progress/read", {});
    if (res.ok === 1) {
      setCaloriesProgress(res.data.calories_progress);
      setCarbsProgress(res.data.carbs_progress);
      setProteinProgress(res.data.protein_progress);
      //  NotificationSettings.notify(res.message, 0);
    } else {
      //NotificationSettings.notify(res.message, 2);
    }
    console.log("done progress");
  }
  async function getPreviousProgress(date: Date) {
    console.log("previous");
    if (!date) return;
    console.log(date.getFullYear());
    console.log(date.getMonth() + 1);
    console.log(date.getDate());
    const res = await Get(API_URL + "/progress/readPast", {
      params: {
        day: Number(date.getDate()),
        year: Number(date.getFullYear()),
        month: Number(date.getMonth() + 1),
      },
    });
    console.log("results");
    console.log(res.hasOwnProperty("data"));
    if (res.ok === 1 && res.hasOwnProperty("data")) {
      setCaloriesProgress(res.data.calories_progress);
      setCarbsProgress(res.data.carbs_progress);
      setProteinProgress(res.data.protein_progress);
      //  NotificationSettings.notify(res.message, 0);
    } else if (res.ok === 1) {
      console.log("here");
      setCaloriesProgress(0);
      setCarbsProgress(0);
      setProteinProgress(0);
      // NotificationSettings.notify(res.message, 0);
    } else {
      // NotificationSettings.notify(res.message, 2);
    }
  }
  async function getFood() {
    setLoading(true);
    const res: response = await Get(API_URL + "/foods/read", {});
    setLoading(false);
    if (res.ok === 1) {
      //initilize servings before mounting
      if (res.data && res.data.length)
        res.data.map((food: foodType) => {
          food["servings"] = 1;
          console.log("****************************************");
          console.log(food);
        });
      setFoodList(res.data);
      NotificationSettings.notify(res.message, 0);
    } else {
      //
      setFoodList([]);
      NotificationSettings.notify(res.message, 2);
    }
  }
  useEffect(() => {
    getFood();
    getProgress();
  }, []);

  useEffect(() => {
    getFood();
    //only when date is good
    if (DateSettings.currentDate.getDate() == new Date().getDate())
      getProgress();
  }, [TabsSettings.foodUpdate]);
  useEffect(() => {
    console.log("current Da te");
    console.log(DateSettings.currentDate);
  }, [DateSettings.currentDate]);
  useEffect(() => {
    //realtime update
    if (currentFood) {
      setFoodList((prev) => {
        return [
          ...prev.slice(
            0,
            prev.findIndex((food: foodType) => food.id == currentFood.id)
          ),
          currentFood,
          ...prev.slice(
            prev.findIndex((food: foodType) => food.id == currentFood.id) + 1
          ),
        ];
      });
    }
  }, [currentFood]);
  useEffect(() => {
    console.log("status home");
    console.log(status);
  }, [status]);
  const renderFoodItem = useCallback(
    ({ item }: { item: foodType }) => (
      <FoodComponent
        key={item.id}
        food={item}
        setStatus={setStatus}
        setCurrentFood={setCurrentFood}
        setFoodList={setFoodList}
        setCarbsProgress={setCarbsProgress}
        setCaloriesProgress={setCaloriesProgress}
        setProteinProgress={setProteinProgress}
      />
    ),
    []
  );
  return (
    <View style={{ position: "relative" }}>
      {loading && (
        <LoadingComponent loading={loading} text="Loading Your Data ..." />
      )}

      <ExtraInfo
        key={currentFood?.id + "currentfood"}
        id={currentFood?.id}
        status={status}
        protein={currentFood?.protein}
        carbs={currentFood?.carbs}
        calories={currentFood?.calories}
        setStatus={setStatus}
        portion={currentFood?.portion}
        name={currentFood?.name}
        setCurrentFood={setCurrentFood}
      />

      {/* <>
        <LottieView
          style={{
            width: screenWidth * 2,
            height: screenHeight * 2,
            position: "absolute",
            left: -screenWidth / 2,
            top: screenHeight / 2,
            opacity: removalAnimate ? 1 : 1,
            transform: [
              { translateY: -screenHeight },
              { translateX: -screenWidth },
            ],
            zIndex: 50,
            padding: 0,
          }}
          speed={2}
          autoPlay
          loop={true}
          source={animations.redot}
        />
        <LottieView
          speed={2}
          style={{
            width: screenWidth * 2,
            height: screenHeight * 2,
            position: "absolute",
            right: -screenWidth / 2,
            top: screenHeight / 2,
            opacity: removalAnimate ? 1 : 1,
            transform: [
              { translateY: -screenHeight },
              { translateX: screenWidth },
            ],
            zIndex: 50,
            padding: 0,
          }}
          autoPlay
          loop={true}
          source={animations.redot}
        />
      </>*/}

      {
        <HomeHeader
          caloriesProgress={caloriesProgress}
          proteinProgress={proteinProgress}
          carbsProgress={carbsProgress}
          setCaloriesProgress={setCaloriesProgress}
          setProteinProgress={setProteinProgress}
          setCarbsProgress={setCarbsProgress}
          setFoodDisplay={setFoodDisplay}
          getPreviousProgress={getPreviousProgress}
          getProgress={getProgress}
        />
      }

      <CheckPopup
        setCarbsProgress={setCarbsProgress}
        setCaloriesProgress={setCaloriesProgress}
        setProteinProgress={setProteinProgress}
      />
      {FoodDisplay && (
        <ScrollView
          style={{
            height: screenHeight - 320,
            width: "100%",
            zIndex: 50000,
          }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <TouchableOpacity onPress={getFood}>
            <Image
              style={{ width: 20, height: 20, marginTop: 5 }}
              source={icons.refresh}
            />
          </TouchableOpacity>
          {foodList && foodList.length > 0 ? (
            foodList.map((food: any) => {
              return (
                <FoodComponent
                  key={food.id}
                  food={food}
                  setStatus={setStatus}
                  setCurrentFood={setCurrentFood}
                  setFoodList={setFoodList}
                  setCarbsProgress={setCarbsProgress}
                  setCaloriesProgress={setCaloriesProgress}
                  setProteinProgress={setProteinProgress}
                />
              );
            })
          ) : (
            <Text>Empty List</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  popup: {},
  instantButton: {
    position: "absolute",
    height: 100,
    width: 60,
    backgroundColor: "white",
    borderRadius: 20,
    top: screenHeight - 110,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 5,
    elevation: 5,
  },
});
