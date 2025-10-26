import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext } from "react";
import icons from "@/app/constants/icons";
import { TabsContext } from "@/app/context/TabsProvider";

const SortComponent = ({ setSorting }: { setSorting: any }) => {
  function popup() {
    setSorting((prev: boolean) => !prev);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={popup}>
        <Image source={icons.sort} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

export default SortComponent;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 250,
    right: 0,
    zIndex: 70000,
    padding: 10,
    paddingTop: 5,
    paddingRight: 5,
  },
  button: {
    overflow: "hidden",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 8,
  },
  image: {
    width: 25,
    height: 25,
  },
});
