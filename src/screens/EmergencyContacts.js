import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import colors from "../colors/Colors";
import { removeContactInformation } from "../components/FlashMessages";
import InformationModal from "../components/InformationModal";
import RNContacts from "react-native-contacts";

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [contactsPermission, setContactsPermission] = useState(false);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const onContactsModalClickHandler = () => {
    setContactsModalVisible(false);
  };

  const storeData = async (storage_key, value) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storage_key, jsonValue);
  };

  const getData = async (storage_key) => {
    const jsonValue = await AsyncStorage.getItem(storage_key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const informationModal = (
    <View>
      <InformationModal
        modalVisible={contactsModalVisible}
        onModalClickHandler={onContactsModalClickHandler}
        modalText={
          "Bu özelliği kullanabilmeniz için uygulamaya kişilerinize erişim izni vermelisiniz!\n\nLütfen izin verdikten sonra uygulamayı yeniden başlatın."
        }
        modalButtonCancelText={"Vazgeç"}
        modalButtonText={"Ayarlara Git"}
        linking={true}
      />
    </View>
  );

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Son depremler ve Acil SMS",
          message:
            "Uygulamanın arka planda SMS gönderebilmesi için izin vermelisiniz.",
          buttonNeutral: "Daha Sonra Sor",
          buttonNegative: "Vazgeç",
          buttonPositive: "Tamam",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        AsyncStorage.setItem("@contactsPermission", granted);
        setContactsPermission(true);
        setContactsModalVisible(false);
      } else {
        AsyncStorage.setItem("@contactsPermission", granted);
        setContactsModalVisible(true);
        setContactsPermission(false);
      }
    } catch {
      console.log("EmergencyContacts | requestContactPermission | CATCH");
    }
  };

  const getContactsFromStorage = useCallback(async () => {
    console.log("EmergencyContacts | getContactsFromStorage");
    const contactsList = await getData("@emergency-contacts");
    setContacts(contactsList);
  }, []);

  const removeContact = async (item) => {
    console.log("EmergencyContacts | removeContact");
    const newContactList = contacts.filter((contact) => contact.id !== item.id);
    storeData("@emergency-contacts", newContactList);
    setContacts(newContactList);
    removeContactInformation();
  };

  const checkContactsPermission = async () => {
    const checkPermission = await AsyncStorage.getItem("@contactsPermission");
    const permission = await RNContacts.checkPermission();
    if (
      (checkPermission === null || checkPermission === "granted") &&
      permission === "authorized"
    ) {
      setContactsPermission(true);
    } else {
      setContactsPermission(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Emergency useEffect & useFocused");
      getContactsFromStorage();
      checkContactsPermission();
    }
  }, [isFocused, getContactsFromStorage]);

  const content = (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={({ item }) => (
          <View style={styles.contactBackground}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
            </View>
            <TouchableOpacity onPress={() => removeContact(item)}>
              <Icon name="minuscircle" size={30} color="#1F1F1F" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.goEmergencyContacts}>
        <AwesomeButton
          onPress={() => {
            navigation.navigate("Kişilerim");
          }}
          textSize={20}
          backgroundColor={colors.buttonBg}
          backgroundDarker={colors.buttonDarkerBg}
        >
          Yeni Kişi Ekle
        </AwesomeButton>
      </View>
    </View>
  );

  const emptyContent = (
    <View style={styles.emptyContainer}>
      {informationModal}
      <AwesomeButton
        onPress={() => {
          if (contactsPermission) {
            navigation.navigate("Kişilerim");
          } else {
            requestContactsPermission();
          }
        }}
        textSize={20}
        backgroundColor={colors.buttonBg}
        backgroundDarker={colors.buttonDarkerBg}
      >
        Kişi Ekle
      </AwesomeButton>
    </View>
  );

  if (contacts === null || contacts.length === 0) {
    return emptyContent;
  } else {
    return content;
  }
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  contactBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
  },
  contactName: {
    fontSize: 20,
    color: colors.buttonBg,
  },
  contactNumber: {
    fontSize: 16,
    color: colors.buttonBg,
  },
  goEmergencyContacts: {
    padding: 10,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
