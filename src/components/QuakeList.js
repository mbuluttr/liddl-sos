import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import colors from "../colors/Colors";

class QuakeList extends PureComponent {
  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.magView}>
          <Text style={styles.mag}>{this.props.item.mag}</Text>
        </View>
        <View style={styles.informatinoView}>
          <View style={styles.elementTopView}>
            <Text style={styles.title}>{this.props.item.title}</Text>
          </View>
          <View style={styles.elementBottomView}>
            <View style={styles.year}>
              <Icon style={styles.icon} name="date" size={16} color="black" />
              <Text style={styles.bottomText}>{this.props.item.date}</Text>
            </View>
            <View style={styles.hour}>
              <Icon style={styles.icon} name="clock" size={16} color="black" />
              <Text style={styles.bottomText}>{this.props.item.hour}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default QuakeList;

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: 5,
    flexDirection: "row",
    paddingVertical: 30,
    backgroundColor: colors.bg,
    shadowColor: colors.textBlack,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  magView: {
    backgroundColor: colors.buttonBg,
    width: 50,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  informatinoView: {
    flex: 1,
    alignSelf: "center",
  },
  mag: {
    fontSize: 24,
    color: colors.textWhite,
  },
  elementTopView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  elementBottomView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 18,
    color: colors.buttonBg,
  },
  year: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  bottomText: { color: colors.buttonBg },
  hour: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
});
