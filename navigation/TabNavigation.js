import { View } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Notification from "../screens/Notification";
import Profile from "../screens/Profile";

export default createBottomTabNavigator({
  Home,
  Search,
  Add: {
    screen: View,
    navigationOptions: {
      tabBarOnPress: ({ navigation }) => navigation.navigate("PhotoNavigation"),
    },
  },
  Notification,
  Profile,
});
