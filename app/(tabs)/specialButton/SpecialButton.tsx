import { notificationContext } from "@/app/context/NotificationProvider";
import { useContext, useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { TabsContext } from "@/app/context/TabsProvider";
import axios from "axios";
import Constants from "expo-constants";
import LoadingComponent from "@/app/components/loadingComponent";
const { API_URL } = Constants.expoConfig?.extra;
type SpecialButtonProps = {
  children: any;
  tab?: any;
};
export default function SpecialButton({ children, tab }: SpecialButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const upAnimated = useRef(new Animated.Value(-7)).current;
  useEffect(() => {
    console.log("changed");
    console.log(tab.index);
    console.log(tab.index == 0);
    if (tab.index == 0) {
      console.log("here");
      Animated.timing(upAnimated, {
        useNativeDriver: false,
        duration: 200,
        toValue: -30,
      }).start();
    } else {
      Animated.timing(upAnimated, {
        useNativeDriver: false,
        duration: 200,
        toValue: 10,
      }).start();
    }
  }, [tab.index]);
  function handlePress() {
    console.log("handling");
    if (tab && tab.index == 0) {
      takePicture();
    }
  }
  const NotificationSettings = useContext(notificationContext);
  const TabsSettings = useContext(TabsContext);
  function parseWeirdDataString(dataString: string) {
    // 1. Wrap keys with double quotes
    let jsonStr = dataString.replace(/(\w+):/g, '"$1":');
    // 2. Replace all single quotes with double quotes
    jsonStr = jsonStr.replace(/'/g, '"');
    // 3. Parse JSON string
    return JSON.parse(jsonStr);
  }
  const uploadImage = async (photo: object) => {
    try {
      console.log(photo);
      const formData = new FormData();

      // Append photo file to formData
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpg",
      } as any);

      // Replace with your backend URL
      let res = null;
      // res = await Post(API_URL + "/foods/upload", {});
      //setLoading(true);
      res = await axios.post(API_URL + "/foods/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const rs = res.data;
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log("rs");
      console.log(rs);
      if (res.data.ok) {
        let parsed = {};
        try {
          parsed = JSON.parse(rs.data);
        } catch (e) {
          parsed = rs.data;
        }

        NotificationSettings.notify(res.data.message, 0);
        //   const parsed = JSON.parse(res.data.data);
        //   setFoodName(parsed["food_name"]);
        //   setCarbs(parsed["carbs"].toString());
        //   setProtein(parsed["protein"].toString());
        //   setPortion(parsed["portion"].toString());
        //   setKcal(parsed["calories"].toString());
        console.log("getting info in");
        await TabsSettings.setInstantProtein(parsed["protein"].toString());
        await TabsSettings.setInstantKcal(parsed["calories"].toString());
        await TabsSettings.setInstantCarbs(parsed["carbs"].toString());
        await TabsSettings.setInstantPortion(parsed["portion"].toString());
        await TabsSettings.setInstantFoodName(parsed["food_name"].toString());
      }
      // setLoading(false);
    } catch (error) {
      NotificationSettings.notify("Upload failed", 2);
      console.error(error.message + " " + error.stack);
      // setLoading(false);
    }
  };
  const takePicture = async () => {
    // Request permissions
    setLoading(true);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: false,
    });

    if (result && !result.canceled) {
      await uploadImage(result.assets[0]);
      await TabsSettings.setClosed(false);
    } else {
      console.log("canceled");
    }
    setLoading(false);
  };

  return (
    <Animated.View
      style={{
        ...styles.customButton,
        top: upAnimated,
        opacity: tab.index != 0 ? 0.7 : 1,
      }}
    >
      {loading && (
        <LoadingComponent text="AI is processing" loading={loading} />
      )}
      <TouchableOpacity onPress={handlePress} disabled={tab.index != 0}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  customButton: {
    zIndex: 10,
    // float above other buttons
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#ffffffff",
    width: 50,
    height: 50,
    borderRadius: 20,
    shadowColor: "white",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
});
