import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { transform } from "@babel/core";

const ChatLoading = () => {
  const updownAnimation = useSharedValue(0);
  const updownAnimation2 = useSharedValue(0);
  const updownAnimation3 = useSharedValue(0);
  const height = 15;
  const duration = 250;
  function animate() {
    updownAnimation.value = withTiming(
      height - updownAnimation.value,
      {
        duration: duration,
      },
      (finished) => {
        if (finished) {
          updownAnimation2.value = withTiming(
            height - updownAnimation2.value,
            {
              duration: duration,
            },
            (finished) => {
              if (finished) {
                updownAnimation3.value = withTiming(
                  height - updownAnimation3.value,
                  {
                    duration: duration,
                  }
                );
              }
            }
          );
        }
      }
    );
  }
  useEffect(() => {
    animate();
    const id = setInterval(() => {}, duration * 3);

    return () => {
      clearInterval(id);
    };
  }, []);
  const updown = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: updownAnimation.value }],
    };
  });
  const updown1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: updownAnimation2.value }],
    };
  });
  const updown2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: updownAnimation3.value }],
    };
  });
  return (
    <View
      style={{
        alignSelf: "center",
        width: 200,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginTop: 15,
      }}
    >
      <Animated.View style={[styles.dot, updown]}></Animated.View>
      <Animated.View style={[styles.dot, updown1]}></Animated.View>
      <Animated.View style={[styles.dot, updown2]}></Animated.View>
    </View>
  );
};

export default ChatLoading;

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#566ed6ff",
    borderRadius: 500,
  },
});
