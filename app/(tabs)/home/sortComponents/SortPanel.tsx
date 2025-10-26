import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect } from "react";
import icons from "@/app/constants/icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TabsContext } from "@/app/context/TabsProvider";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { foodType } from "@/app/types";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SortPanel = ({
  sorting,
  setFoodList,
}: {
  sorting: boolean;
  setFoodList: any;
}) => {
  const opacityValue = useSharedValue(0);

  function handleSort(macro: string, way: number) {
    console.log(macro);
    console.log(way);
    switch (macro) {
      case "Calories":
        switch (way) {
          case 1:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => foodA.calories - foodB.calories
              );
              return sorted;
            });
            break;
          case 0:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => -foodA.calories + foodB.calories
              );
              return sorted;
            });
            break;
        }
        break;
      case "Carbs":
        switch (way) {
          case 1:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => foodA.carbs - foodB.carbs
              );
              return sorted;
            });
            break;
          case 0:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => -foodA.carbs + foodB.carbs
              );
              return sorted;
            });
            break;
        }
        break;
      case "Protein":
        switch (way) {
          case 1:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => foodA.protein - foodB.protein
              );
              return sorted;
            });
            break;
          case 0:
            setFoodList((prev: foodType[]) => {
              const sorted = [...prev].sort(
                (foodA, foodB) => -foodA.protein + foodB.protein
              );
              return sorted;
            });
            break;
        }
        break;
    }
  }
  function test() {
    setFoodList((prev: foodType[]) => {
      return [];
    });
  }
  useEffect(() => {
    console.log("hiii");
    if (sorting) {
      opacityValue.value = withTiming(1, { duration: 200 });
    } else {
      console.log("here");
      opacityValue.value = withTiming(0, { duration: 200 });
    }
  }, [sorting]);

  const opacityAnimation = useAnimatedStyle(() => {
    return { opacity: opacityValue.value };
  });

  return (
    <>
      {sorting && (
        <Animated.View style={[styles.container, opacityAnimation]}>
          <View style={styles.col}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Calories", 1)}
              >
                <Text style={styles.buttonText}>Calories</Text>
                <Image source={icons.up} style={styles.image} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Calories", 0)}
              >
                <Text style={styles.buttonText}>Calories</Text>
                <Image source={icons.down} style={styles.image} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Protein", 1)}
              >
                <Text style={styles.buttonText}>Protein</Text>
                <Image source={icons.up} style={styles.image} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Protein", 0)}
              >
                <Text style={styles.buttonText}>Protein</Text>
                <Image source={icons.down} style={styles.image} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Carbs", 1)}
              >
                <Text style={styles.buttonText}>Carbs</Text>
                <Image source={icons.up} style={styles.image} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSort("Carbs", 0)}
              >
                <Text style={styles.buttonText}>Carbs</Text>
                <Image source={icons.down} style={styles.image} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default SortPanel;

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  container: {
    position: "absolute",
    top: 270,
    right: screenWidth / 2 - 125,
    zIndex: 7000000,
    backgroundColor: "white",
    width: 250,
    height: 120,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 8,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 7,
  },
  button: {
    overflow: "hidden",
    width: "100%",
    height: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonText: {
    fontSize: 10,
    height: "100%",
    textAlign: "center",
    width: 50,
    alignSelf: "center",
    textAlignVertical: "center",
  },
  col: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: 60,
    margin: 10,
  },
  image: {
    width: 7,
    height: 7,
  },
});
