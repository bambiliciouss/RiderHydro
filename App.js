import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./Navigator/MainNavigator";
import Auth from "./Context/store/Auth";
import Toast from "react-native-toast-message";
import store from "./Redux/Store";
import { Provider } from "react-redux";

import { NativeBaseProvider, extendTheme } from "native-base";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <MainNavigator />
            <Toast />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import MainNavigator from "./Navigator/MainNavigator";
// import Auth from "./Context/store/Auth";
// import Toast from "react-native-toast-message";
// import store from "./Redux/Store";
// import { Provider } from "react-redux";

// import { NativeBaseProvider, extendTheme } from "native-base";

// const newColorTheme = {
//   brand: {
//     900: "#8287af",
//     800: "#7c83db",
//     700: "#b3bef6",
//   },
// };
// const theme = extendTheme({ colors: newColorTheme });

// import React, { useState, useRef, useCallback } from "react";
// import MapView, { Marker } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
// import { GOOGLE_MAP_KEY } from "./constants/googleMapKey";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";

// export default function App() {
//   const [state, setState] = useState({
//     pickupCords: [
//       {
//         latitude: 14.494087346187696,
//         longitude: 121.05091685129169,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       },

//       {
//         latitude: 14.4989123456789,
//         longitude: 121.055123456789,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       },
//     ],
//     droplocationCors: {
//       latitude: 14.50849676364391,
//       longitude: 121.03506301482969,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     },
//   });

//   const mapref = useRef();
//   const { pickupCords, droplocationCors } = state;
//   const [currentLocation, setCurrentLocation] = useState(null);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     const getLocation = async () => {
//   //       let { status } = await Location.requestForegroundPermissionsAsync();
//   //       if (status !== "granted") {
//   //         console.log("Permission to access location was denied");
//   //         return;
//   //       }

//   //       let location = await Location.getCurrentPositionAsync({});
//   //       setCurrentLocation(location.coords);
//   //     };

//   //     getLocation();
//   //   }, [])
//   // );

//   return (
//     // <Auth>
//     //   <Provider store={store}>
//     //     <NativeBaseProvider theme={theme}>
//     //       <NavigationContainer>
//     //         <MainNavigator />
//     //         <Toast />
//     //       </NavigationContainer>
//     //     </NativeBaseProvider>
//     //   </Provider>
//     // </Auth>

//     <View style={styles.container}>
//       <MapView style={StyleSheet.absoluteFill} initialRegion={pickupCords[0]}>
//         {pickupCords.map((coord, index) => (
//           <Marker key={index} coordinate={coord} />
//         ))}
//         <Marker coordinate={droplocationCors} />

//         {pickupCords.map((coord, index) => (
//           <MapViewDirections
//             key={index}
//             origin={coord}
//             destination={droplocationCors}
//             apikey={GOOGLE_MAP_KEY}
//             strokeWidth={3}
//             strokeColor="#00bbff"
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
