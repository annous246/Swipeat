import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
interface messagePropType {
  content: string;
  icon?: any;
  me: boolean;
}
const Message = ({ content, icon, me }: messagePropType) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: me ? "flex-end" : "flex-start",
        backgroundColor: "white",
        marginTop: 10,
        padding: 5,
      }}
    >
      <Image source={icon} style={{ height: 30, width: 30, marginRight: 20 }} />
      <Text
        style={{
          width: "70%",
          fontSize: 14,
          backgroundColor: me ? "#168AFF" : "#959797ff",
          padding: 10,
          color: "white",
          borderRadius: 10,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
