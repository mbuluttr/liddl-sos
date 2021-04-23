import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import {
  recentQuakesRefresh,
  apiErrorMessage,
  quakesFromStorage,
} from "../components/FlashMessages";
import colors from "../colors/Colors";
import QuakeList from "../components/QuakeList";
import { env } from "../../environments";

const RecentEarthquakes = () => {
  const url = env.API_URL;
  const [quakes, setQuakes] = useState([]);
  const [indicator, setIndicator] = useState(true);
  const isFocused = useIsFocused();

  const storeData = async (storage_key, value) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storage_key, jsonValue);
  };

  const getData = async (storage_key) => {
    const jsonValue = await AsyncStorage.getItem(storage_key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const getEarthQuakesFromAPI = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setIndicator(false);
      const data = response.data.result;
      const arrList = [];
      data.map(({ title, mag, timestamp, hash }) => {
        const longDate = new Date(timestamp * 1000);
        const hour = longDate.toLocaleTimeString();
        const date = moment(longDate.toLocaleDateString(), "MM/DD/YYYY").format(
          "DD/MM/YYYY"
        );
        if (mag.toString().length === 1) {
          mag = mag + ".0";
        }
        arrList.push({ title, mag, date, hour, hash });
      });
      setQuakes(arrList);
      storeData("@earthquakes", arrList);
    } catch {
      getEarthQuakesFromStorage();
    }
  }, [getEarthQuakesFromStorage]);

  const getEarthQuakesFromStorage = useCallback(async () => {
    const earthQuakesList = await getData("@earthquakes");
    if (earthQuakesList === null) {
      apiErrorMessage();
      setIndicator(true);
      return;
    }
    quakesFromStorage();
    setIndicator(false);
    setQuakes(earthQuakesList);
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("RecentEarthquakes | Focused");
      getEarthQuakesFromAPI();
    }
  }, [isFocused, getEarthQuakesFromAPI]);

  return (
    <View style={styles.container}>
      {indicator ? (
        <View style={styles.indicator}>
          <ActivityIndicator size={75} color={colors.menuBg} />
        </View>
      ) : (
        <View>
          <FlatList
            data={quakes}
            initialNumToRender={7}
            refreshing={false}
            onRefresh={() => {
              getEarthQuakesFromAPI();
              recentQuakesRefresh();
            }}
            renderItem={({ item }) => <QuakeList item={item} />}
            keyExtractor={(item) => item.hash}
          />
        </View>
      )}
    </View>
  );
};

export default RecentEarthquakes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FAEE",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
