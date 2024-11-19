import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { IP_ADDRESS } from '../../config';

export default function JobWorking_Dropoff_Screen() {
  const route = useRoute();
  const navigation = useNavigation(); // Access navigation
  const { request_id } = route.params || {};
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/auth/getRequestDetailForDriver?request_id=${request_id}`);
        const data = await response.json();
        if (data && data.Status && data.Result.length > 0) {
          setOffer(data.Result[0]);
        } else {
          setOffer(null); // No data found
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (request_id) {
      fetchOfferDetails();
    }
  }, [request_id]);

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    } else {
      alert('หมายเลขโทรศัพท์ไม่พร้อมใช้งาน');
    }
  };

  const handleConfirmation = () => {
    // Navigate to the CarUploadConfirmation screen
    navigation.navigate('CarUploadDropOffConfirmation', {request_id});
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Header with cancel and report buttons */}
        <View style={tw`flex-row justify-between my-7`}>
          <Text style={tw`text-lg text-green-600 font-bold`}>ยกเลิกงาน</Text>
          <Text style={tw`text-lg text-green-600 font-bold`}>แจ้งปัญหา</Text>
        </View>

        {/* Customer Information */}
        {offer ? (
          <View style={tw`p-4 bg-gray-100 rounded-lg mb-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-800`}>คุณ {offer.customer_name}</Text>
              <TouchableOpacity onPress={() => handleCall(offer.customer_phone)}>
                <Text style={tw`text-blue-600`}>ติดต่อ</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={tw`text-center text-gray-500`}>ไม่พบข้อมูลลูกค้า</Text>
        )}

        {/* Map with Marker (Touchable for navigation) */}
        {offer && offer.dropoff_lat && offer.dropoff_long && (
          <TouchableOpacity onPress={() => openGoogleMaps(offer.dropoff_lat, offer.dropoff_long)}>
            <View style={tw`flex bg-gray-300 items-center justify-center mb-4 rounded-lg h-70`}>
              <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                  latitude: parseFloat(offer.dropoff_lat),
                  longitude: parseFloat(offer.dropoff_long),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(offer.dropoff_lat),
                    longitude: parseFloat(offer.dropoff_long),
                  }}
                  title="จุดรับ"
                  description="ตำแหน่งที่ตั้งของการรับ"
                />
              </MapView>
            </View>
          </TouchableOpacity>
        )}

        {/* Address Details */}
        {offer && (
          <View>
            <Text style={tw`text-gray-700`}>รายละเอียดที่อยู่</Text>
            <Text style={tw`text-gray-700 mb-4`}>
              {offer.location_to || 'ไม่มีข้อมูลเพิ่มเติม'}
            </Text>
            <Text style={tw`text-gray-700`}>รายละเอียดเพิ่มเติม</Text>
            <Text style={tw`text-gray-700 mb-4`}>
              {offer.customer_message || ''}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Fixed Confirmation Button */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-4`}>
        <TouchableOpacity onPress={handleConfirmation} style={tw`bg-green-500 rounded-full p-4 items-center`}>
          <Text style={tw`text-white font-bold text-lg`}>ยืนยันถึงที่หมาย</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
