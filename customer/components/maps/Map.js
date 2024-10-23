import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Button , Text, Dimensions} from "react-native";

import tw from "twrnc"; // import twrnc

import MapView, { Circle, Marker, Polygon, Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../../src/config/constants";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";


function Map({setDestination,setOrigin}) {
  const initialLocation = {
    latitude: 13.827187145167997,
    longitude: 100.6548010679114,
    latitudeDelta: 0.1922,
    longitudeDelta: 0.1421,
  };
  const [myLocation, setMyLocation] = useState(initialLocation);
  const [pin, setPin] = useState({});
  const [region, setRegion] = useState(null);
  // const [origin, setOrigin] = useState();
  // const [destination, setDestination] = useState();
  const mapRef = useRef();
  const local = {
    latitude: "13.855862029345975",
    longitude: "100.5854679968677",
    latitudeDelta: 0.1922,
    longitudeDelta: 0.1421,
  };

  useEffect(() => {
    setPin(local);
    _getLocation();
    setOrigin(myLocation);
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
          timeInterval: 1000, // อัปเดตทุก 1 วินาที
          distanceInterval: 1, // อัปเดตทุกครั้งเมื่อเคลื่อนที่ 1 เมตร
        },
        (location) => {
          console.warn("Location");
          setMyLocation(location.coords);
        }
      );
    } catch (error) {
      console.warn("Error");
      console.warn(error);
    }
  };
  

  const focusOnLocation = () => {
    // alert("Get Location")
    if (myLocation.latitude && myLocation.longitude) {
      // alert("Get Location")
      const NewRegion = {
        latitude: parseFloat(myLocation.latitude),
        longitude: parseFloat(myLocation.longitude),
        latitudeDelta: 0.1043,
        longitudeDelta: 0.1704
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(NewRegion, 1000);
      }
    }
  };

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      2000
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 relative`}>
      <View style={{ zIndex: 10, flex: 0.5}}>
        <View style={tw`z-10 flex-1`}>
          <GooglePlacesAutocomplete
            //ต้องขอ api
            fetchDetails={true}
            placeholder="Origin"
            changeText={(value) => console.log(value)}
            onPress={(data, details = null) => {
              console.log(data, details);
              let originCordinates = {
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
              };
              setOrigin(originCordinates);
              moveToLocation(originCordinates);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("ไม่พบสถานที่")}
          />
        </View>
        {/* <View style={tw`z-10 flex-1`}>
          <GooglePlacesAutocomplete
            //ต้องขอ api
            fetchDetails={true}
            placeholder="Destination"
            onPress={(data, details = null) => {
              let destinationCordinates = {
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
              };
              setDestination(destinationCordinates);
              moveToLocation(destinationCordinates);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "th",
            }}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("ไม่พบสถานที่")}
          />
        </View> */}
      </View>
      <View style={tw`flex-1`}>
        <MapView
          style={tw`w-full h-full`}
          region={region}
          onRegionChangeComplete={setRegion}
          ref={mapRef}
        >
          {pin.latitude && pin.longitude && (
            <Marker
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              pinColor="green"
              title="Spu"
              description="มหาลัยศรีปทุม"
            />
          )}

          {myLocation.latitude && myLocation.longitude && (
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              pinColor="blue"
              title="ตําแหน่งของฉัน"
              description="อยู่นี่จ้า"
            />
          )}

          {myLocation.latitude && myLocation.longitude && (
            <Marker
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
          )}

          {/* <Marker coordinate={origin}></Marker> 

          <Marker coordinate={destination}></Marker> */}

          <Circle
            center={myLocation}
            radius={2000}
            fillColor="rgba(255, 0, 0, 0.1)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />

          {/* <Polyline //ไปเฉยๆ
            strokeWidth={2}
            strokeColor="blue"
            coordinates={[
              { latitude: 13.827187145167997, longitude: 100.6548010679114 },
              { latitude: 13.855862029345975, longitude: 100.5854679968677 },
            ]}
          />

          <Polygon //กลับมาจุดเริ่ม
            strokeWidth={2}
            strokeColor="blue"
            coordinates={[
              { latitude: 13.827187145167997, longitude: 100.6548010679114 },
              { latitude: 13.855862029345975, longitude: 100.5854679968677 },
              { latitude: 13.87837310149788, longitude: 100.6397109907839 },
            ]}
          /> */}

          {/* {origin != undefined && destination != undefined ? (
            <MapViewDirections
              origin={origin}
              strokeColor="blue"
              strokeWidth={3}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
            />
          ) : null} */}
        </MapView>
        <View style={tw`bg-green-50 absolute -bottom-7 left-0 right-0 flex-row justify-center `}>
          <Button title="Go To My Home" color={"black"} onPress={() => {focusOnLocation()}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Map;
