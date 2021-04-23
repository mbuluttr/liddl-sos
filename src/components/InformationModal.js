import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import colors from "../colors/Colors";

const InformationModal = ({
  modalVisible,
  onModalClickHandler,
  modalText,
  modalButtonCancelText,
  modalButtonText,
  modalNavigation,
  linking,
}) => {
  const navigation = useNavigation();

  const openSettings = async () => {
    await Linking.openSettings();
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        onModalClickHandler();
      }}
    >
      <TouchableWithoutFeedback onPress={() => onModalClickHandler()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>

            <View style={styles.modalButtons}>
              <AwesomeButton
                onPress={() => {
                  onModalClickHandler();
                }}
                textSize={15}
                backgroundColor={colors.buttonBg}
                backgroundDarker={colors.buttonDarkerBg}
                width={100}
              >
                {modalButtonCancelText}
              </AwesomeButton>
              {modalButtonText ? (
                <AwesomeButton
                  onPress={() => {
                    onModalClickHandler();
                    if (linking) {
                      openSettings();
                    } else {
                      navigation.navigate(modalNavigation);
                    }
                  }}
                  textSize={15}
                  backgroundColor={colors.buttonBg}
                  backgroundDarker={colors.buttonDarkerBg}
                  width={100}
                >
                  {modalButtonText}
                </AwesomeButton>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InformationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    padding: 20,
    height: 300,
    backgroundColor: colors.menuBg,
    borderRadius: 7,
    elevation: 5,
    justifyContent: "center",
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    color: colors.textWhite,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
