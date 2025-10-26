import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { foodType } from "@/app/types";
import icons from "../../../constants/icons";
import CustomButton from "@/app/components/customButton";
import { router } from "expo-router";
import ExtraInfo from "../Info/ExtraInfo/ExtraInfo";
import InlineInfo from "../Info/InlineInfo";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
const { API_URL } = Constants.expoConfig?.extra;
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Constants from "expo-constants";
import { Post } from "@/app/services/api";
import { TabsContext } from "@/app/context/TabsProvider";
import { notificationContext } from "@/app/context/NotificationProvider";
const { height: ScreenHeight, width: screenWidth } = Dimensions.get("window");
const FoodComponent = ({
  food,
  setCurrentFood,
  setFoodList,
  setStatus,
  setProteinProgress,
  setCarbsProgress,
  setCaloriesProgress,
}: {
  setFoodList: any;
  food: foodType;
  setCurrentFood: any;
  setStatus: any;
  setProteinProgress: any;
  setCarbsProgress: any;
  setCaloriesProgress: any;
}) => {
  const infoStatus = useRef(false);
  const [handleSwipe, setHandleSwipe] = useState<boolean>(true);
  const marginValue = useSharedValue(10);
  const heightAnimate = useSharedValue(100);
  const translateValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);
  function redirect() {
    setCurrentFood(food);
    setTimeout(() => {
      setStatus(true);
    }, 500);
  }
  const TabSettings = useContext(TabsContext);
  const NotificationSettings = useContext(notificationContext);

  const RemovalThreashold = screenWidth / 3;
  const infoStyle = {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 20,
    margin: "auto",
  };
  const deleteStyle = {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 100,
    margin: 0,
    left: 5,
    top: 5,
    alignSelf: "flex-left",
  };
  function info() {
    infoStatus.current = !infoStatus.current;
    heightAnimate.value = withTiming(!infoStatus.current ? 100 : 150, {
      duration: 200,
    });
  }
  function up() {
    console.log("up");
    if (food.servings < 999) {
      setFoodList((prev: foodType[]) => {
        const result = [
          ...prev.slice(
            0,
            prev.findIndex((f) => {
              return food.id == f.id;
            })
          ),
          { ...food, servings: food.servings + 1 },
          ...prev.slice(prev.findIndex((f) => food.id == f.id) + 1),
        ];

        return result;
      });
    }
  }
  function down() {
    if (food.servings > 1) {
      setFoodList((prev: foodType[]) => {
        const result = JSON.parse(
          JSON.stringify([
            ...prev.slice(
              0,
              prev.findIndex((f) => {
                return food.id == f.id;
              })
            ),
            { ...food, servings: food.servings - 1 },
            ...prev.slice(prev.findIndex((f) => food.id == f.id) + 1),
          ])
        );

        return result;
      });
    }
  }
  async function addMacros() {
    const ret = await Post(API_URL + "/progress/update_progress", {
      calories: food.servings * food.calories,
      protein: food.servings * food.protein,
      carbs: food.servings * food.carbs,
    });

    return ret;
  }
  async function addConsumed() {
    const ret = await Post(API_URL + "/foods/consumed/add", {
      servings: food.servings,
      id: food.id,
    });

    return ret;
  }
  async function remove() {
    //add to macros
    setCaloriesProgress(
      (prev: number) => prev + food.servings * +food.calories
    );
    setCarbsProgress((prev: number) => prev + food.servings * food.carbs);
    setProteinProgress((prev: number) => prev + food.servings * food.protein);
    const ret = await addMacros();
    const ret2 = await addConsumed();
    if (ret.ok === 1 && ret2.ok === 1) {
      //remove food
      setFoodList((prev: foodType[]) => {
        const fp: foodType[] = prev.slice(
          0,
          prev.findIndex((element) => element.id == food.id)
        );
        const sp: foodType[] = prev.slice(
          prev.findIndex((element) => element.id == food.id) + 1
        );
        return [...fp, ...sp];
      });
      //notify for food changes (no need it slow user experience)
      //TabSettings.setFoodUpdate((prev: boolean) => !prev);
      NotificationSettings.notify(ret.message, 0);
    } else {
      reverse();
      console.log("rev");
      if (ret.ok !== 1) {
        NotificationSettings.notify(ret.message, 2);
      }
      if (ret2.ok !== 1) {
        NotificationSettings.notify(ret2.message, 2);
      }
    }
  }
  async function deletefood() {
    const res = await Post(API_URL + "/foods/delete", { foodId: food.id });

    if (res.ok === 1) {
      //remove food
      setFoodList((prev: foodType[]) => {
        const fp: foodType[] = prev.slice(
          0,
          prev.findIndex((element) => element.id == food.id)
        );
        const sp: foodType[] = prev.slice(
          prev.findIndex((element) => element.id == food.id) + 1
        );
        return [...fp, ...sp];
      });

      //notify for food changes (no need it slow user experience)
      //TabSettings.setFoodUpdate((prev: boolean) => !prev);
      NotificationSettings.notify(res.message, 0);
    } else {
      NotificationSettings.notify(res.message, 2);
    }
  }
  function reverse() {
    //remove to macros
    setCaloriesProgress(
      (prev: number) => food.servings * (prev - food.calories)
    );
    setCarbsProgress((prev: number) => food.servings * (prev - food.carbs));
    setProteinProgress((prev: number) => food.servings * (prev - food.protein));
    marginValue.value = withTiming(10, { duration: 200 });
    heightAnimate.value = withTiming(100, { duration: 200 });
    opacityValue.value = withTiming(1, { duration: 200 });
    translateValue.value = withTiming(0, { duration: 300 });
  }
  useEffect(() => {}, [handleSwipe]);
  const handleAdding = useAnimatedGestureHandler({
    onActive: (event) => {
      translateValue.value = event.translationX;
    },
    onFinish: () => {},
    onEnd: () => {
      if (Math.abs(translateValue.value) > RemovalThreashold) {
        //remove
        translateValue.value = withTiming(
          translateValue.value > 0 ? screenWidth : -screenWidth,
          { duration: 200 }
        );
        opacityValue.value = withTiming(0, { duration: 200 }, (done) => {
          if (done) {
            marginValue.value = withTiming(0, { duration: 200 });
            heightAnimate.value = withTiming(0, { duration: 300 }, (done) => {
              runOnJS(remove)();
            });
          }
        });
      } else {
        //take back

        translateValue.value = withSpring(0);
      }
    },
  });
  const animation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateValue.value }],
      opacity: opacityValue.value,
      marginVertical: marginValue.value,
      height: heightAnimate.value,
    };
  });

  return (
    <GestureHandlerRootView style={{ width: "80%" }}>
      <PanGestureHandler
        onGestureEvent={handleAdding}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-10, 10]}
      >
        <Animated.View
          style={[
            {
              zIndex: 0,
              position: "relative",
            },
            animation,
          ]}
        >
          <TouchableOpacity
            onPress={info}
            style={{ ...styles.mainContainer, height: "100%" }}
          >
            <CustomButton
              style={deleteStyle}
              currentIcon={icons.deletei}
              iconStyle={{
                width: "100%",
                height: "100%",
              }}
              onPress={deletefood}
            />
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={icons.food} />
              </View>
              <View style={styles.column}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    maxWidth: 100,
                  }}
                >
                  {food.name}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "300" }}>
                  {food.calories?.toFixed(1)} kcals
                </Text>
              </View>

              <CustomButton
                style={infoStyle}
                currentIcon={icons.info}
                iconStyle={{
                  width: "100%",
                  height: "100%",
                }}
                onPress={redirect}
              />
              <View
                style={{
                  ...styles.column,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity style={styles.servingBtn} onPress={up}>
                  <Image
                    source={icons.up}
                    style={{ height: "100%", width: "100%" }}
                  />
                </TouchableOpacity>
                <Text style={{ textAlign: "center", marginVertical: 5 }}>
                  {food.servings}
                </Text>
                <TouchableOpacity style={styles.servingBtn} onPress={down}>
                  <Image
                    source={icons.down}
                    style={{ height: "100%", width: "100%" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <InlineInfo
              protein={food.protein}
              carbs={food.carbs}
              calories={food.calories}
            />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default React.memo(FoodComponent);

const styles = StyleSheet.create({
  servingBtn: {
    borderWidth: 1,
    width: 20,
    height: 20,
    padding: 3,
    borderRadius: 100,
  },
  mainContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-start",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    padding: 15,
    marginTop: "0%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: 100,
    overflow: "hidden",
  },
  spanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 100,
    marginRight: 20,
  },
});
