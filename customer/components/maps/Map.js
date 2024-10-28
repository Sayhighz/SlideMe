import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

import tw from "twrnc"; // import twrnc

import MapView, { Circle, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

// 13.855827502824274, 100.58551678180032

function Map({ setDestination, setOrigin, origin, destination, store }) {
  const [myLocation, setMyLocation] = useState({});
  const [region, setRegion] = useState(null);

  const [spuAddress,setSpuAddress] = useState({
    latitude:13.855827502824274,
    longitude:100.58551678180032
  })

  useEffect(() => {
    _getLocation();
    setDestination(spuAddress)
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission");
        console.warn("Permission to access location was denied");
        return;
      }

      // เฝ้าดูตำแหน่งของผู้ใช้แบบเรียลไทม์
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 600000, // Update every 10 minutes
          // distanceInterval: 1
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          // Set user's current location
          // setOrigin(location.coords);
          setMyLocation(location.coords);
          setRegion(newRegion); // Set the initial region to zoom in
        }
      );
    } catch (error) {
      console.warn("Error");
      console.warn(error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 relative`}>
      <View style={tw`flex-1`}>
        <MapView
          style={tw`w-full h-full`}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              pinColor="green"
              title="ตําแหน่งของฉัน"
              description="อยู่นี่จ้า"
            />

          <Marker
            draggable
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            pinColor="red"
            title="ต้นทาง"
            description="ศรีปทุม"
            onDragEnd={(e) => {
              const newLocation = e.nativeEvent.coordinate;
              setDestination(newLocation);
            }}
          />

          {/* <Marker
              draggable
              coordinate={{
                latitude: 13.854543008326594, 
                longitude: 100.6155871693916
              }}
              pinColor="red"
              title="ลองลากดู"
              description="ตำแหน่งใหม่ของคุณ"
              onDragEnd={(e) => {
                const newLocation = e.nativeEvent.coordinate;
                setDestination(newLocation);
              }}
            />
                        <Marker
              draggable
              coordinate={{
                latitude: 13.754543008326594, 
                longitude: 100.6155871693916
              }}
              pinColor="red"
              title="ลองลากดู"
              description="ตำแหน่งใหม่ของคุณ"
              onDragEnd={(e) => {
                const newLocation = e.nativeEvent.coordinate;
                setOrigin(newLocation);
              }}
            /> */}

          {/* {
            (destination == null || destination.length === 0) && (
              store.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  pinColor="blue"
                  title={item.name}
                  description={item.price}
                />
              ))
            )
          } */}

          {/* Marker Origin */}
          {/* {
            origin ?
            <Marker 
              coordinate={{
                latitude:origin.latitude,
                longitude:origin.longitude
              }}
              pinColor="green"
              title="ต้นทาง"
              description="ตำแหน่งต้นทางจ้า"
            />
            : null
          } */}

          {/* Marker destination */}
          {/* {
            destination ? 
            <Marker 
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude
              }}
              pinColor="red"
              title="ปลายทาง"
              description="ตำแหน่งปลายทางจ้า"
            /> 
            : null
          } */}

          {/* ระยะรอบตัว */}
          {/* <Circle
            center={myLocation}
            radius={5000}
            fillColor="rgba(255, 0, 0, 0.1)"
            strokeColor="rgba(255, 0, 0, 0.1)"
          /> */}

          {/* เส้นทาง */}
          {origin && destination && origin.latitude && destination.latitude ? (
            <MapViewDirections
              strokeColor="blue"
              strokeWidth={3}
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              onError={(errorMessage) => {
                console.log("Error fetching directions: ", errorMessage);
                alert("ไม่พบเส้นทางระหว่างจุดต้นทางและปลายทางที่ระบุ");
              }}
            />
          ) : null}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

export default Map;
