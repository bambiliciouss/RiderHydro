import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import { GOOGLE_MAP_KEY } from "../../constants/googleMapKey";
import imagePath from "../../constants/imagePath";
import MapViewDirections from "react-native-maps-directions";
import Loader from "../../Components/MapsComponents/Loader";
import {
  locationPermission,
  getCurrentLocation,
  getLocation,
} from "../../Components/helper/helperFunction";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const OutDeliveries2 = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [outdeliveriesLoc, setoutdeliveriesLoc] = useState(null);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const getLiveLocation = async () => {
    console.log(
      "Checking Live Location------------------------------------------------"
    );
    const locPermissionDenied = await locationPermission();
    console.log(locPermissionDenied);

    if (locPermissionDenied) {
      const location = await getLocation();
      if (location) {
        console.log("Rider Current position:", location);
        setState((prevState) => ({
          ...prevState,
          curLoc: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }));
        handleSaveCurrentLocation(location);
      } else {
        console.log("Unable to retrieve location");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveCurrentLocation = async (location) => {
    const formData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    axios
      .post(`${baseURL}create/location`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          // Toast.show({
          //   topOffset: 60,
          //   type: "success",
          //   text1: "Rider Location Saved",
          //   text2: "",
          // });
          console.log("Location Saved");
          console.log("Location Data Saved", formData);
        }
      })
      .catch((error) => {
        console.log("Location error:", error);
        // Toast.show({
        //   position: "bottom",
        //   bottomOffset: 20,
        //   type: "error",
        //   text1: "Something went wrong",
        //   text2: "Please try again",
        // });
      });
  };

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
                //console.log("Out for Deliveries: ", res.data.orders);
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

  const mapRef = useRef();

  const [state, setState] = useState({
    curLoc: {
      latitude: 14.494076958745957,
      longitude: 121.05091685175243,
    },
    isLoading: false,
  });

  const { curLoc, isLoading } = state;

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              initialRegion={{
                ...curLoc,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}>
              <Marker coordinate={curLoc}>
                <Image
                  source={imagePath.icCurLoc}
                  style={{ width: 60, height: 60 }} // Adjust the width and height as needed
                  resizeMode="contain"
                />
              </Marker>

              {/* {Object.keys(destinationCords).length > 0 && (
            <Marker
              coordinate={destinationCords}
              image={imagePath.icGreenMarker}
            />
          )} */}

              {outdeliveriesLoc &&
                outdeliveriesLoc.map((delivery, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: delivery.deliveryAddress.latitude,
                      longitude: delivery.deliveryAddress.longitude,
                    }}
                    //image={imagePath.house}
                    title={`${delivery.customer.fname} ${delivery.customer.lname}`}
                    onPress={() =>
                      navigation.navigate("OrderSummary", {
                        orderId: delivery._id,
                      })
                    }>
                    <Image
                      source={imagePath.house}
                      style={{ width: 60, height: 60 }} // Adjust the width and height as needed
                      resizeMode="contain"
                    />
                  </Marker>
                ))}

              {outdeliveriesLoc &&
                outdeliveriesLoc.map((delivery, index) => (
                  <MapViewDirections
                    key={index}
                    origin={curLoc}
                    //destination={destinationCords}
                    destination={{
                      latitude: delivery.deliveryAddress.latitude,
                      longitude: delivery.deliveryAddress.longitude,
                    }}
                    apikey={GOOGLE_MAP_KEY}
                    strokeWidth={6}
                    strokeColor="#00bbff"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                      console.log(
                        `Started routing between "${params.origin}" and "${params.destination}"`
                      );
                    }}
                    onReady={(result) => {
                      console.log(
                        `${delivery.customer.fname} ${delivery.customer.lname}`
                      );
                      console.log(`Distance: ${result.distance} km`);
                      console.log(`Duration: ${result.duration} min.`);
                      fetchTime(result.distance, result.duration),
                        mapRef.current.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            // right: 30,
                            // bottom: 300,
                            // left: 30,
                            // top: 100,
                          },
                        });
                    }}
                    onError={(errorMessage) => {
                      // console.log('GOT AN ERROR');
                    }}
                  />
                ))}
            </MapView>
            {/* <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}>
          <Image source={imagePath.greenIndicator} />
        </TouchableOpacity> */}
          </View>
          {/* <View style={styles.bottomCard}>
        <Text>Where are you going..?</Text>
        <TouchableOpacity onPress={onPressLocation} style={styles.inpuStyle}>
          <Text>Choose your location</Text>
        </TouchableOpacity>
      </View> */}
          <Loader isLoading={isLoading} />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: "white",
    width: "100%",
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    marginTop: 16,
  },
});

export default OutDeliveries2;
