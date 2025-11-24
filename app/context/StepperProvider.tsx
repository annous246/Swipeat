import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AuthContext } from "./AuthProvider";

interface StepperContextSettingsInterface {
  stepper: boolean;
  setStepper: any;
}
const StepperContext = createContext<StepperContextSettingsInterface>({
  stepper: false,
  setStepper: null,
});

// headers: { Authorization: userToken }
interface StepperContextInterface {
  children: any;
}

const StepperProvider = (props: StepperContextInterface) => {
  const [stepper, setStepper] = useState<boolean>(false);
  const AuthSettings = useContext(AuthContext);
  async function saveStep() {
    console.log("stepper context");
    if (stepper) await AsyncStorage.setItem("stepper", JSON.stringify(stepper));
    else await AsyncStorage.removeItem("stepper");
  }
  useEffect(() => {
    saveStep();
  }, [stepper]);

  return (
    <StepperContext.Provider
      value={{
        stepper: stepper,
        setStepper: setStepper,
      }}
    >
      {props.children}
    </StepperContext.Provider>
  );
};

export { StepperContext, StepperProvider };
