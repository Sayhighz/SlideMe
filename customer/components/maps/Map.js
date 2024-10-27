import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Button, Text, Dimensions } from "react-native";
import tw from "twrnc"; // import twrnc
import MapView, { Circle, Marker, Polygon, Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

function Map({ setDestination, setOrigin, origin, destination, store }) {
  const [myLocation, setMyLocation] = useState({});
  const [region, setRegion] = useState(null);

  useEffect(() => {
    _getLocation();
    setOrigin({
      latitude: 13.854543008326594,
      longitude: 100.6155871693916,
    });
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      // Watch user's location in real-time
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 600000, // Update every 10 minutes
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
          setOrigin(location.coords);
          setMyLocation(location.coords);
          setRegion(newRegion); // Set the initial region to zoom in
        }
      );
    } catch (error) {
      console.warn("Error fetching location", error);
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
          {/* Render current location marker if coordinates are available */}
          {myLocation.latitude && myLocation.longitude && (
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              pinColor="green"
              title="ตําแหน่งของฉัน"
              description="อยู่นี่จ้า"
            />
          )}

          {/* Render draggable marker if origin is available */}
          {origin.latitude && origin.longitude && (
            <Marker
              draggable
              coordinate={{
                latitude: 13.854543008326594,
                longitude: 100.6155871693916,
              }}
              pinColor="red"
              title="ลองลากดู"
              description="ตำแหน่งใหม่ของคุณ"
              onDragEnd={(e) => {
                const newLocation = e.nativeEvent.coordinate;
                setDestination(newLocation);
              }}
            />
          )}

          {/* Render store markers if destination is not set */}
          {(!destination || destination.length === 0) &&
            store.map((item, index) => (
              item.latitude && item.longitude && ( // Check for valid coordinates
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
              )
            ))}

          {/* Render destination marker if available */}
          {destination && destination.latitude && destination.longitude && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              pinColor="red"
              title="ปลายทาง"
              description="ตำแหน่งปลายทางจ้า"
            />
          )}

          {/* Draw a circle around the user's location */}
          {myLocation.latitude && myLocation.longitude && (
            <Circle
              center={myLocation}
              radius={5000}
              fillColor="rgba(255, 0, 0, 0.1)"
              strokeColor="rgba(255, 0, 0, 0.1)"
            />
          )}

          {/* Render directions if both origin and destination are set */}
          {origin &&
            destination &&
            origin.latitude &&
            destination.latitude && (
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
            )}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

export default Map;
