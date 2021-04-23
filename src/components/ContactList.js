import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../colors/Colors";

class ContactList extends PureComponent {
  render() {
    return (
      <View>
        <Text style={styles.contactName}>{this.props.item.name}</Text>
        <Text style={styles.contactNumber}>{this.props.item.phoneNumber}</Text>
      </View>
    );
  }
}
export default ContactList;

const styles = StyleSheet.create({
  contactName: {
    fontSize: 20,
    color: colors.buttonBg,
  },
  contactNumber: {
    fontSize: 16,
    color: colors.buttonBg,
  },
});
