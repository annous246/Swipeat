import { StyleSheet, Text, View } from "react-native";
import React, { Children, createContext, useState } from "react";
interface tabsContextType {
  foodUpdate: boolean;
  setFoodUpdate: any;
  closed: boolean;
  sorting: boolean;
  setClosed: any;
  instantProtein: string;
  instantKcal: string;
  instantCarbs: string;
  instantPortion: string;
  instantFoodName: string;
  setInstantProtein: any;
  setInstantKcal: any;
  setInstantCarbs: any;
  setInstantPortion: any;
  setInstantFoodName: any;
  setSorting: any;
}

const TabsContext = createContext<tabsContextType>({
  foodUpdate: true,
  setFoodUpdate: null,
  closed: true,
  setClosed: null,
  setInstantProtein: null,
  setInstantKcal: null,
  setInstantCarbs: null,
  setInstantPortion: null,
  setInstantFoodName: null,
  instantProtein: "0.0",
  instantKcal: "0.0",
  instantCarbs: "0.0",
  instantPortion: "0.0",
  instantFoodName: "",
  setSorting: null,
  sorting: false,
});
const TabsProvider = ({ children }: { children: any }) => {
  const [foodUpdate, setFoodUpdate] = useState<boolean>(true);
  const [closed, setClosed] = useState<boolean>(true);
  const [instantCarbs, setInstantCarbs] = useState<string>("0.0");
  const [instantKcal, setInstantKcal] = useState<string>("0.0");
  const [instantProtein, setInstantProtein] = useState<string>("0.0");
  const [instantPortion, setInstantPortion] = useState<string>("0.0");
  const [instantFoodName, setInstantFoodName] = useState<string>("");
  const [sorting, setSorting] = useState<boolean>(false);

  return (
    <TabsContext.Provider
      value={{
        setInstantCarbs,
        setInstantProtein,
        setInstantKcal,
        setInstantFoodName,
        setInstantPortion,
        instantKcal,
        instantProtein,
        instantCarbs,
        instantFoodName,
        instantPortion,
        closed,
        setClosed,
        foodUpdate,
        setFoodUpdate,
        setSorting,
        sorting,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export { TabsProvider, TabsContext };

const styles = StyleSheet.create({});
