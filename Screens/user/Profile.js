import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import baseURL from "../../assets/common/baseurl";

import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Button from "../../Components/Button";
import Toast from "react-native-toast-message";

const Profile = () => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          if (
            context.stateUser.isAuthenticated === false ||
            context.stateUser.isAuthenticated === null
          ) {
            navigation.navigate("Login");
          }

          const jwt = await AsyncStorage.getItem("jwt");
          console.log("Token", jwt);
          const response = await axios.get(`${baseURL}me`, {
            headers: { Authorization: `Bearer ${jwt}` },
            withCredentials: true,
          });

          // Set user profile from response data
          setUserProfile(response.data.user);

          // Log the user data here
          console.log("User Data", response.data.user);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();

      return () => {
        // Cleanup code if needed
        setUserProfile(""); // Clear user profile state
        console.log("Data Cleared");
      };
    }, [
      context.stateUser.isAuthenticated,
      context.stateUser.user.id,
      navigation,
    ])
  );

  useEffect(() => {
    if (userProfile) {
      console.log(userProfile.avatar.url);
    }
  }, [userProfile]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              userProfile && userProfile.avatar && userProfile.avatar.url
                ? userProfile.avatar.url
                : "default_avatar_uri",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {userProfile.fname} {userProfile.lname}
          {/* {userProfile && userProfile.user ? userProfile.user.fname : ""}{" "}
          {userProfile && userProfile.user ? userProfile.user.lname : ""} */}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{userProfile.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoValue}>+63{userProfile.phone}</Text>
      </View>
      {/* <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoValue}>
          {userProfile && userProfile.user ? userProfile.user.houseNo : ""},{" "}
          {userProfile && userProfile.user ? userProfile.user.purokNum : ""},{" "}
          {userProfile && userProfile.user ? userProfile.user.streetName : ""},{" "}
          {userProfile && userProfile.user ? userProfile.user.barangay : ""},{" "}
          {userProfile && userProfile.user ? userProfile.user.city : ""}
        </Text>
      </View> */}

      <Button
        title="Edit Profile"
        filled
        style={{
          marginTop: 18,
          marginBottom: 4,
        }}
        onPress={() => navigation.navigate("EditProfile")}
      />

      <Button
        title="Logout"
        filled
        style={{
          marginTop: 18,
          marginBottom: 4,
        }}
        onPress={() => [
          AsyncStorage.removeItem("jwt"),
          logoutUser(context.dispatch),
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: `Logout Successfully`,
            text2: "Please Comeback Again",
          }),
        ]}
      />

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
});

export default Profile;
