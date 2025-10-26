import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import icons from "@/app/constants/icons";
import { foodType } from "@/app/types";
import { TabsContext } from "@/app/context/TabsProvider";

interface searchBarPropsType {
  setFoodList: any;
  setFilteredOutFoodlist: any;
  filteredOutFoodList: foodType[];
  foodList: foodType[];
}
const SearchBar = ({
  setFoodList,
  setFilteredOutFoodlist,
  filteredOutFoodList,
  foodList,
}: searchBarPropsType) => {
  const TabSettings = useContext(TabsContext);
  const [currentSearch, setCurretnSearch] = useState<string>("");
  useEffect(() => {
    //food goot updated (reset) -> reset search (bug prevention)
    setCurretnSearch("");
  }, [TabSettings.foodUpdate]);
  function handleChanges(input: string) {
    setCurretnSearch(input);
  }

  function reset() {
    setCurretnSearch("");
  }
  useEffect(() => {
    if (currentSearch.length) {
      //searching

      //whats getting back in
      const refilteredIn = filteredOutFoodList.filter((i: foodType) => {
        return i.name.toLowerCase().includes(currentSearch.toLowerCase());
      });
      //what is getting out
      const filteredOut = foodList.filter((i: foodType) => {
        return !i.name.toLowerCase().includes(currentSearch.toLowerCase());
      });
      //what should stay
      const filteredIn = foodList.filter((i: foodType) => {
        return i.name.toLowerCase().includes(currentSearch.toLowerCase());
      });

      setFoodList([...refilteredIn, ...filteredIn]);

      setFilteredOutFoodlist((prev: foodType[]) => {
        let idsToReturn: number[] = refilteredIn.map(
          (item: foodType) => item.id
        );
        console.log(idsToReturn);
        let newList = [...prev].filter((foodItem: foodType) => {
          return !idsToReturn.includes(foodItem.id);
        });

        return [...filteredOut, ...newList];
      });
    } else {
      //reset
      console.log("reset");
      console.log(filteredOutFoodList);
      setFoodList((prev: foodType[]) => {
        return [...prev, ...filteredOutFoodList];
      });
      setFilteredOutFoodlist((prev: foodType[]) => {
        console.log(prev);
        return [];
      });
    }
  }, [currentSearch]);
  return (
    <View style={styles.container}>
      <View style={{ width: "90%" }}>
        <TextInput
          style={styles.bar}
          onChangeText={handleChanges}
          value={currentSearch}
          placeholder="Peanut Butter"
        />

        <TouchableOpacity style={styles.reset} onPress={reset}>
          <Image source={icons.x} style={{ width: 15, height: 15 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  reset: {
    position: "absolute",
    right: "0%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
  },
  bar: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    height: 40,
  },
  container: {
    position: "relative",
    width: "100%",
    height: 47,
    padding: 5,
    backgroundColor: "transparent",
  },
});
