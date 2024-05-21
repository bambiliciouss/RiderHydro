import { View, Text } from "react-native";
import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import OutDeliveries from "../Screens/maps/OutDeliveries";
import OutDeliveries2 from "../Screens/maps/OutDeliveries2";
import OrderList from "../Screens/maps/OrderList";
import OrderSummary from "../Screens/maps/OrderSummary";
const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}>
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        option={{
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        option={{
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="OutDeliveries2"
        component={OutDeliveries2}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default MapStack;
