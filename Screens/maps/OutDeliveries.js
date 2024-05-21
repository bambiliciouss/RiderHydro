import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAP_KEY } from "../../constants/googleMapKey";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { useSelector, useDispatch } from "react-redux";
import * as Location from "expo-location";

const OutDeliveries = () => {
  const context = useContext(AuthGlobal);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    pickupCords: [
      {
        latitude: 14.494087346187696,
        longitude: 121.05091685129169,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },

      {
        latitude: 14.4989123456789,
        longitude: 121.055123456789,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    ],
    droplocationCors: {
      latitude: 14.50849676364391,
      longitude: 121.03506301482969,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  const mapref = useRef();
  const { pickupCords, droplocationCors } = state;

  const [outdeliveriesLoc, setoutdeliveriesLoc] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!context.stateUser.isAuthenticated) {
        navigation.navigate("User", { screen: "Login" });
      } else {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}/all/rider/orders/out`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((res) => {
                setoutdeliveriesLoc(res.data.orders);
                setLoading(false);
                console.log("Out for Deliveries: ", res.data.orders);
              });
          })
          .catch((error) => console.log(error));

        return () => {
          setoutdeliveriesLoc([]);
          setLoading(true);
        };
      }
    }, [context.stateUser.isAuthenticated])
  );

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  useFocusEffect(
    useCallback(() => {
      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      };

      getLocation();
    }, [])
  );

  useEffect(() => {
    if (outdeliveriesLoc) {
      outdeliveriesLoc.forEach((delivery) => {
        console.log(
          "Delivery Latitude:",
          delivery.deliveryAddress.latitude,
          delivery.deliveryAddress.longitude
        );
      });
    }
    console.log(currentLocation);
    console.log(initialRegion);
  });

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
        {outdeliveriesLoc &&
          outdeliveriesLoc.map((delivery, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: delivery.deliveryAddress.latitude,
                longitude: delivery.deliveryAddress.longitude,
              }}
            />
          ))}
        {/* <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="blue"
        /> */}
        {/* <Marker coordinate={currentLocation} /> */}

        {outdeliveriesLoc &&
          outdeliveriesLoc.map((delivery, index) => (
            <MapViewDirections
              key={index}
              origin={currentLocation}
              destination={{
                latitude: delivery.deliveryAddress.latitude,
                longitude: delivery.deliveryAddress.longitude,
              }}
              apikey={GOOGLE_MAP_KEY}
              strokeWidth={3}
              strokeColor="#00bbff"
            />
          ))}
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OutDeliveries;
