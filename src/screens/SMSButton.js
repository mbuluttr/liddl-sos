import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import InformationModal from "../components/InformationModal";
import Geolocation from "@react-native-community/geolocation";
import SendSMS from "react-native-sms";
import {
  openLocationService,
  locationTimeout,
} from "../components/FlashMessages";

const screenWidth = Dimensions.get("window").width;

const SMSButton = () => {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [waitLocation, setWaitLocation] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [smsModalVisible, setSMSModalVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const isFocused = useIsFocused();

  const onContactsModalClickHandler = () => {
    setContactsModalVisible(false);
  };

  const onSMSModalClickHandler = () => {
    setSMSModalVisible(false);
  };

  const sendSMS = () => {
    setIsClicked(true);
  };

  const cancelSMS = () => {
    setIsClicked(false);
  };

  const getData = async (storage_key) => {
    const jsonValue = await AsyncStorage.getItem(storage_key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const getMessage = async () => {
    const messageFromStore = await AsyncStorage.getItem("@message");
    setMessage(messageFromStore);
  };

  const getContacts = useCallback(async () => {
    const smsList = [];
    const contactsList = await getData("@emergency-contacts");
    if (contactsList !== null) {
      contactsList.forEach((element) => {
        smsList.push(element.phoneNumber);
      });
    }
    setContacts(smsList);
  }, []);

  const getLocation = useCallback(async () => {
    const locationToggleStatus = await AsyncStorage.getItem(
      "@locationToggleStatus"
    );
    setLocationStatus(locationToggleStatus);
    if (locationToggleStatus === "true") {
      console.log(
        "getLocation > If | SMS Button Location status: ",
        locationStatus
      );
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = `http://maps.google.com/maps?&z=15&q=${position.coords.latitude}+${position.coords.longitude}&ll=${position.coords.latitude}+${position.coords.longitude}`;
            setLocation(currentLocation);
            console.log(currentLocation);
            if (currentLocation.length > 0) {
              setWaitLocation(false);
            }
          },
          (error) => {
            console.log(error);
            if (error.message === "No location provider available.") {
              openLocationService();
              setWaitLocation(false);
            } else {
              locationTimeout();
              setWaitLocation(false);
            }
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
      } catch {
        console.log(
          "getLocation > Catch | SMS Button Location status: ",
          locationStatus
        );
        setWaitLocation(false);
        setLocationStatus(false);
      }
    } else {
      setWaitLocation(false);
      console.log(
        "getLocation > Else | SMS Button Location status: ",
        locationStatus
      );
    }
  }, [locationStatus]);

  const onSendSMS = useCallback(async () => {
    if (contacts.length > 0 && message != null) {
      if (locationStatus === "true" && location.length > 0) {
        console.log("With Location");
        const withLocation = message + "\n\nKonum bilgilerim | " + location;
        SendSMS.send(
          {
            body: withLocation,
            recipients: contacts,
            successTypes: ["sent", "queued"],
            allowAndroidSendWithoutReadPermission: true,
          },
          (completed, cancelled, error) => {
            console.log(completed, cancelled, error);
          }
        );
      } else {
        console.log("No Location");
        SendSMS.send(
          {
            body: message,
            recipients: contacts,
            successTypes: ["sent", "queued"],
            allowAndroidSendWithoutReadPermission: true,
          },
          (completed, cancelled, error) => {
            console.log(completed, cancelled, error);
          }
        );
      }
    }
    if (contacts.length === 0) {
      setContactsModalVisible(true);
    }
    if (contacts.length > 0 && message == null) {
      setSMSModalVisible(true);
    }
  }, [contacts, location, locationStatus, message]);

  useEffect(() => {
    if (isFocused) {
      console.log("SMS Button useEffect & useFocused");
      getMessage();
      getContacts();
      getLocation();
    } else {
      setWaitLocation(true);
    }
  }, [isFocused, getContacts, getLocation]);

  useEffect(() => {
    const timer =
      isClicked &&
      setTimeout(() => {
        setIsClicked(false);
        onSendSMS();
      }, 3000);
    return () => clearTimeout(timer);
  }, [isClicked, onSendSMS]);

  return (
    <View style={styles.screens}>
      <InformationModal
        modalVisible={contactsModalVisible}
        onModalClickHandler={onContactsModalClickHandler}
        modalText={
          "Bu özelliği kullanabilmeniz için 'Acil Durum Kişilerim' menüsünden kişi eklemelisiniz!"
        }
        modalButtonCancelText={"Vazgeç"}
        modalButtonText={"Kişi Ekle"}
        modalNavigation={"Acil Durum Kişilerim"}
      />
      <InformationModal
        modalVisible={smsModalVisible}
        onModalClickHandler={onSMSModalClickHandler}
        modalText={
          "Bu özelliği kullanabilmeniz için 'SMS Düzenle' menüsünden acil durum mesajı oluşturmalısınız!"
        }
        modalButtonCancelText={"Vazgeç"}
        modalButtonText={"Mesaj Oluştur"}
        modalNavigation={"SMS ve Konum Ayarları"}
      />

      <AwesomeButton
        progress
        onPress={(next) => {
          isClicked ? cancelSMS() : sendSMS();
          next();
        }}
        progressLoadingTime={3000}
        backgroundProgress={"#141414"}
        backgroundDarker={"#141414"}
        backgroundColor={"#1F1F1F"}
        disabled={waitLocation}
        raiseLevel={15}
        height={220}
        width={220}
        textSize={24}
      >
        {waitLocation
          ? "Konum Bilgisi Alınıyor..."
          : isClicked
          ? "İptal Et"
          : "SMS Gönder"}
      </AwesomeButton>
    </View>
  );
};

const styles = StyleSheet.create({
  screens: {
    flex: 1,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1FAEE",
  },
  texts: {
    fontSize: 20,
    padding: 15,
    color: "white",
    textAlign: "center",
  },
});

export default SMSButton;
