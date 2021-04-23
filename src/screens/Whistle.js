import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import Sound from "react-native-sound";

Sound.setCategory("Playback");
const playbackObject = new Sound("whistle.mp3", Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log(error);
    return;
  }
});

const Whistle = () => {
  const [iconStatus, setIconStatus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const isFocused = useIsFocused();

  const toggleSwitch = () =>
    setIsEnabled((previousState) => {
      AsyncStorage.setItem("@whistleToggleStatus", String(!previousState));
      return !previousState;
    });

  const playAudio = async () => {
    if (isEnabled) {
      setIconStatus(true);
      playbackObject.setNumberOfLoops(-1);
      playbackObject.play();
    } else {
      setIconStatus(false);
      playbackObject.setNumberOfLoops(0);
      playbackObject.play();
    }
  };

  const pauseAudio = useCallback(async () => {
    setIconStatus(false);
    playbackObject.stop();
  }, []);

  const checkToggle = async () => {
    const toggleStatus = await AsyncStorage.getItem("@whistleToggleStatus");
    if (toggleStatus === "true") {
      setIsEnabled(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Whistle | Whistle useEffect & useFocused");
      checkToggle();
    } else {
      pauseAudio();
    }
  }, [isFocused, pauseAudio]);

  return (
    <View style={styles.screens}>
      <AwesomeButton
        progress
        onPress={(next) => {
          if (iconStatus) {
            pauseAudio();
          } else {
            playAudio();
          }
          next();
        }}
        progressLoadingTime={3000}
        backgroundProgress={"#141414"}
        backgroundDarker={"#141414"}
        backgroundColor={"#1F1F1F"}
        raiseLevel={15}
        height={220}
        width={220}
        textSize={24}
      >
        {iconStatus ? (
          <Icon name="pause" size={128} color="#F1FAEE" />
        ) : (
          <Icon name="whistle" size={128} color="#F1FAEE" />
        )}
      </AwesomeButton>
      <View style={styles.switchView}>
        <Text style={styles.switchText}>Sürekli çal</Text>
        <Switch
          trackColor={{ false: "gray", true: "gray" }}
          thumbColor={isEnabled ? "#E63946" : "#1F1F1F"}
          onValueChange={() => {
            toggleSwitch();
          }}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default Whistle;

const styles = StyleSheet.create({
  screens: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1FAEE",
  },
  switchView: {
    flexDirection: "row",
    marginTop: 30,
  },
  switchText: {
    marginRight: 5,
    fontSize: 18,
    color: "#1F1F1F",
  },
});
