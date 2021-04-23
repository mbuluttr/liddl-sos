import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import RecentEarthquakes from "./src/screens/RecentEarthquakes";
import FlashMessage from "react-native-flash-message";
import colors from "./src/colors/Colors";
import EditSMS from "./src/screens/EditSMS";
import Whistle from "./src/screens/Whistle";
import SMSButton from "./src/screens/SMSButton";
import Contacts from "./src/screens/Contacts";
import EmergencyContacts from "./src/screens/EmergencyContacts";
import SplashScreen from "react-native-splash-screen";

const Stack = createStackNavigator();

const ContactsScreen = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Acil Durum Kişilerim" component={EmergencyContacts} />
      <Stack.Screen name="Kişilerim" component={Contacts} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const App = () => {
  useEffect(() => SplashScreen.hide());
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.statusBarBg}
      />
      <Drawer.Navigator
        drawerStyle={{ backgroundColor: colors.menuBg }}
        drawerType={"slide"}
        drawerContentOptions={{
          activeTintColor: colors.textWhite,
          labelStyle: { fontSize: 20, color: colors.textWhite },
        }}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.menuBg,
          },
          headerTitleStyle: {
            fontSize: 20,
          },
          headerTintColor: colors.textWhite,
          headerTitleAlign: "center",
        }}
        initialRouteName="Son Depremler"
      >
        <Drawer.Screen name="Son Depremler" component={RecentEarthquakes} />
        <Drawer.Screen name="SMS Gönder" component={SMSButton} />
        <Drawer.Screen name="Düdük Çal" component={Whistle} />
        <Drawer.Screen name="Acil Durum Kişilerim" component={ContactsScreen} />
        <Drawer.Screen name="SMS ve Konum Ayarları" component={EditSMS} />
      </Drawer.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default App;
