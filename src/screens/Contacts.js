import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AwesomeButton from "react-native-really-awesome-button/src/themes/bruce";
import { contactAlreadyExist } from "../components/FlashMessages";
import RNContacts from "react-native-contacts";
import ContactList from "../components/ContactList";
import colors from "../colors/Colors";

const compare = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchableContacts, setSearchableContacts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [indicator, setIndicator] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const storeData = async (storage_key, value) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storage_key, jsonValue);
  };

  const getData = async (storage_key) => {
    const jsonValue = await AsyncStorage.getItem(storage_key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const getContacts = useCallback(async () => {
    console.log("Contacts | getContacts");
    try {
      const data = await RNContacts.getAll();
      setIndicator(false);
      const arrList = [];
      const flagList = [];

      data.forEach((item) => {
        if (item.phoneNumbers[0]) {
          const contact = {
            id: item.recordID,
            name: item.displayName,
            phoneNumber: item.phoneNumbers[0].number,
          };
          if (flagList.includes(contact.name)) {
            return;
          }
          flagList.push(contact.name);
          arrList.push(contact);
        }
      });

      arrList.sort(compare);
      setContacts(arrList);
      setSearchableContacts(arrList);
      const emergencyContactList = await getData("@emergency-contacts");
      setEmergencyContacts(JSON.stringify(emergencyContactList));
    } catch {
      console.log("Contacts | getContacts | Catch");
      AsyncStorage.setItem("@contactsPermission", "false");
      navigation.navigate("Acil Durum Kişilerim");
    }
  }, [navigation]);

  const addContactToEmergencyContacts = async (item) => {
    console.log("Contacts | addContactToEmergencyContacts");
    const contact = {
      id: item.id,
      name: item.name,
      phoneNumber: item.phoneNumber,
    };
    const arrList = [];
    const oldValues = await getData("@emergency-contacts");
    if (JSON.stringify(oldValues).includes(JSON.stringify(contact))) {
      contactAlreadyExist();
      return;
    }
    if (oldValues) {
      arrList.push(...oldValues, contact);
    } else {
      arrList.push(contact);
    }
    const newContactList = contacts.filter((value) => value.id !== item.id);
    setContacts(newContactList);
    setSearchableContacts(newContactList);
    storeData("@emergency-contacts", arrList);
  };

  const searchContacts = (value) => {
    const filteredContacts = searchableContacts.filter((contact) => {
      let contactLowercase = contact.name.toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    setContacts(filteredContacts);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Contacts | useEffect & useFocused");
      getContacts();
    }
  }, [isFocused, getContacts]);

  return (
    <View style={styles.container}>
      {indicator ? (
        <View style={styles.indicator}>
          <ActivityIndicator size={75} color={colors.buttonDarkerBg} />
        </View>
      ) : (
        <View style={styles.flex}>
          <TextInput
            style={styles.textInput}
            placeholder="Arama"
            onChangeText={(value) => searchContacts(value)}
          />
          <FlatList
            data={contacts}
            renderItem={({ item }) => (
              <View style={styles.contactBackground}>
                <View>
                  <ContactList item={item} />
                </View>
                <TouchableOpacity
                  onPress={() => addContactToEmergencyContacts(item)}
                >
                  {emergencyContacts.includes(item.name) ? (
                    <Icon name="checkcircle" size={30} color={colors.menuBg} />
                  ) : (
                    <Icon name="pluscircle" size={30} color={colors.buttonBg} />
                  )}
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
            initialNumToRender={7}
          />
          <View style={styles.addContact}>
            <AwesomeButton
              onPress={() => {
                navigation.navigate("Acil Durum Kişilerim");
              }}
              textSize={20}
              backgroundColor={colors.buttonBg}
              backgroundDarker={colors.buttonDarkerBg}
            >
              Geri Dön
            </AwesomeButton>
          </View>
        </View>
      )}
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  contactBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
  },

  addContact: {
    padding: 10,
    alignItems: "center",
  },
  textInput: {
    fontSize: 18,
    backgroundColor: colors.bg,
    padding: 25,
    elevation: 5,
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
