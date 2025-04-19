import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const SearchBar = ({ 
  placeholder, 
  onBackPress, 
  onLocationSelect, 
  apiKey, 
  hasConfirmedOrigin,
  isLoading = false
}) => {
  const iconColor = hasConfirmedOrigin ? "#10B981" : "#3B82F6";
  
  return (
    <View style={[
      tw`w-11/12 rounded-xl bg-white shadow-lg border-0 overflow-visible`,
      Platform.OS === 'ios' ? tw`shadow-opacity-10` : {}
    ]}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`py-2.5 pl-3 pr-1`}>
          <TouchableOpacity 
            style={tw`p-1.5 rounded-full active:bg-gray-100`}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View style={tw`flex-1 border-l border-gray-200 ml-1`}>
          <GooglePlacesAutocomplete
            styles={{
              container: {
                flex: 1,
              },
              textInput: {
                height: 46,
                fontSize: 16,
                backgroundColor: 'transparent',
                marginBottom: 0,
                paddingVertical: 10,
                paddingHorizontal: 12,
                fontFamily: Platform.OS === 'ios' ? "System" : "Mitr-Regular",
                color: '#1F2937',
              },
              listView: {
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: 8,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                zIndex: 9999,
                borderWidth: Platform.OS === 'ios' ? 1 : 0,
                borderColor: Platform.OS === 'ios' ? '#E5E7EB' : 'transparent',
              },
              row: {
                padding: 13,
                backgroundColor: 'white',
              },
              separator: {
                height: 1,
                backgroundColor: '#E5E7EB',
              },
              description: {
                fontFamily: Platform.OS === 'ios' ? "System" : "Mitr-Regular",
                color: '#4B5563',
                fontSize: 14,
              },
              poweredContainer: {
                display: 'none',
              }
            }}
            fetchDetails={true}
            placeholder={placeholder}
            minLength={2}
            debounce={300}
            renderLeftButton={() => (
              <View style={tw`ml-2 justify-center`}>
                <MaterialIcons 
                  name="search" 
                  size={22} 
                  color={iconColor} 
                />
              </View>
            )}
            renderRightButton={() => (
              isLoading ? (
                <View style={tw`mr-3 justify-center`}>
                  <ActivityIndicator size="small" color={iconColor} />
                </View>
              ) : hasConfirmedOrigin ? (
                <View style={tw`mr-2 py-1 px-2 bg-green-100 rounded-full justify-center`}>
                  <Text style={[styles.globalText, tw`text-xs text-green-700`]}>
                    {hasConfirmedOrigin ? "ปลายทาง" : "ต้นทาง"}
                  </Text>
                </View>
              ) : (
                <View style={tw`mr-2 py-1 px-2 bg-blue-100 rounded-full justify-center`}>
                  <Text style={[styles.globalText, tw`text-xs text-blue-700`]}>
                    {hasConfirmedOrigin ? "ปลายทาง" : "ต้นทาง"}
                  </Text>
                </View>
              )
            )}
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                onLocationSelect({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }
            }}
            query={{
              key: apiKey,
              language: "th",
              components: "country:th",
              strictbounds: true,
              location: "13.7563, 100.5018", // Bangkok center
              radius: "50000", // 50km radius
            }}
            onFail={(error) => console.log("GooglePlaces Error:", error)}
            onNotFound={() => console.log("ไม่พบสถานที่")}
            enablePoweredByContainer={false}
            nearbyPlacesAPI="GooglePlacesSearch"
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Mitr-Regular" : "Mitr-Regular",
    ...Platform.select({
      ios: {
        fontWeight: '500',
      },
    }),
  },
});

export default SearchBar;