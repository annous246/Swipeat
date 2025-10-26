import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import icons from "@/app/constants/icons";
import Chat from "./Chat";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const ChatbotPanel = ({
  setClose,
}: {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  function close() {
    setClose(true);
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text
          style={{
            width: "80%",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Our 24/7 AI Assistant
        </Text>
        <TouchableOpacity style={styles.close} onPress={close}>
          <Image source={icons.x} style={{ height: "50%", width: "50%" }} />
        </TouchableOpacity>
      </View>
      <Chat />
    </View>
  );
};

export default ChatbotPanel;

const styles = StyleSheet.create({
  close: {
    width: 30,
    backgroundColor: "white",
    height: 30,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 500,
  },
  header: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
    backgroundColor: "#f1f1f1ff",
    height: "10%",
  },
  mainContainer: {
    overflow: "hidden",
    position: "absolute",
    alignSelf: "center",
    height: screenHeight - 100,
    width: screenWidth - 60,
    borderRadius: 10,
    backgroundColor: "white",
    zIndex: 70000,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
