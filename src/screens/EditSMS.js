import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Keyboard,
  Switch,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { messageCorrect, messageEmpty } from "../components/FlashMessages";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import InformationModal from "../components/InformationModal";

const width = Dimensions.get("screen").width;

const EditSMS = () => {
  const [message, setMessage] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [editSMSModalVisible, setEditSMSModalVisible] = useState(false);
  const isFocused = useIsFocused();

  const onEditSMSModalClickHandler = () => {
    setEditSMSModalVisible(false);
  };

  const informationModal = (
    <View>
      <InformationModal
        modalVisible={editSMSModalVisible}
        onModalClickHandler={onEditSMSModalClickHandler}
        modalText={
          "Bu özelliği kullanabilmeniz için uygulamaya konumunuza erişim izni vermelisiniz!\n\nLütfen izin verdikten sonra uygulamayı yeniden başlatın."
        }
        modalButtonCancelText={"Vazgeç"}
        modalButtonText={"Ayarlara Git"}
        linking={true}
      />
    </View>
  );

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => {
      if (!previousState) {
        requestLocationPermission();
        AsyncStorage.setItem("@locationToggleStatus", "true");
      } else {
        AsyncStorage.setItem("@locationToggleStatus", "false");
      }
      return !previousState;
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Son depremler ve Acil SMS",
          message:
            "Bu özelliği kullanabilmeniz için uygulamaya konumunuza erişim izni vermelisiniz.",
          buttonNeutral: "Daha Sonra Sor",
          buttonNegative: "Vazgeç",
          buttonPositive: "Tamam",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        AsyncStorage.setItem("@locationPermission", granted);
        setEditSMSModalVisible(false);
      } else {
        AsyncStorage.setItem("@locationPermission", granted);
        AsyncStorage.setItem("@locationToggleStatus", "false");
        setIsEnabled(false);
        setEditSMSModalVisible(true);
      }
    } catch (error) {
      console.log("EditSMS | requestLocationPermission | CATCH");
    }
  };

  const getMessage = async () => {
    const messageFromStore = await AsyncStorage.getItem("@message");
    const toggleStatus = await AsyncStorage.getItem("@locationToggleStatus");
    if (toggleStatus === "true") {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
    setMessage(messageFromStore);
  };

  const saveMessage = async () => {
    if (message === null) {
      messageEmpty();
    } else {
      Keyboard.dismiss();
      messageCorrect();
      await AsyncStorage.setItem("@message", message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Edit SMS useEffect & useFocused");
      getMessage();
    }
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {informationModal}

        <View style={styles.textInput}>
          <TextInput
            placeholder="Acil durum mesajınız..."
            value={message}
            multiline={true}
            numberOfLines={10}
            maxLength={180}
            defaultValue={message}
            onChangeText={(newMessageText) => setMessage(newMessageText)}
          />
        </View>
        <View style={styles.switchView}>
          <Text style={styles.switchText}>Konum bilgisini ekle</Text>
          <Switch
            trackColor={{ false: "gray", true: "gray" }}
            thumbColor={isEnabled ? "#E63946" : "#1F1F1F"}
            onValueChange={() => {
              toggleSwitch();
            }}
            value={isEnabled}
          />
        </View>
        <AwesomeButton
          style={styles.submitButton}
          onPress={saveMessage}
          textSize={20}
          backgroundColor={"#1F1F1F"}
          backgroundDarker={"#141414"}
          width={width / 2.5}
        >
          Kaydet
        </AwesomeButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditSMS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FAEE",
    alignItems: "center",
  },
  textInput: {
    alignSelf: "stretch",
    backgroundColor: "#F1FAEE",
    marginHorizontal: 25,
    marginTop: 25,
    padding: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  submitButton: {
    marginTop: 35,
  },
  switchView: {
    flexDirection: "row",
    marginTop: 35,
  },
  switchText: {
    marginRight: 5,
    fontSize: 18,
    color: "#1F1F1F",
  },
});
