// JobsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from '../../config'; // Import IP_ADDRESS from config

function truncateText(text, maxLength = 12) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 'ไม่ทราบระยะห่าง'; // Return 'N/A' if coordinates are missing

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (earthRadiusKm * c).toFixed(2) + ' KM'; // Return distance in kilometers with 2 decimal places
}

function JobCard({ requestId, distance, origin, destination, type, time, message }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={tw`p-4 mb-4 bg-white rounded-lg shadow-lg`}
      onPress={() => 
        navigation.navigate('JobDetail', { 
          requestId,
          distance, 
          origin, 
          destination, 
          type, 
          message 
        })
      }
    >
      <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>ระยะทางประมาณ {distance}</Text>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`flex-row items-center`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-600 ml-1 text-base`}>
            {truncateText(origin)}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-600 ml-1 text-base`}>
            {truncateText(destination)}
          </Text>
        </View>
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-gray-500 text-sm`}>ประเภท: {type}</Text>
        <Text style={tw`text-gray-500 text-sm`}>เวลาเริ่มงาน: {time ? time : 'ไม่ระบุ'}</Text>
      </View>
      {message && (
        <Text style={tw`text-gray-600 mt-2`}>ข้อความลูกค้า: {truncateText(message)}</Text>
      )}
    </TouchableOpacity>
  );
}


export default function JobsScreen() {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/auth/getRequests`);
        const data = await response.json();

        // Check if data.Result is an array
        if (data && data.Status && Array.isArray(data.Result)) {
          setRequests(data.Result);
        } else {
          console.warn('Unexpected API response format:', data);
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]); // Set requests to an empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header Bar with Back Button and Title */}
      <View style={tw`bg-green-500 p-4 pt-8 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-white ml-4`}>งานวันนี้</Text>
      </View>

      {/* Jobs List */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : requests.length > 0 ? (
          requests.map((request) => {
            const distance = calculateDistance(
              parseFloat(request.pickup_lat),
              parseFloat(request.pickup_long),
              parseFloat(request.dropoff_lat),
              parseFloat(request.dropoff_long)
            );

            return (
              <JobCard
                key={request.request_id}
                requestId={request.request_id} // Pass request_id to JobCard
                distance={distance}
                origin={request.location_from}
                destination={request.location_to}
                type={request.vehicle_type}
                time={
                  request.booking_time
                    ? new Date(request.booking_time).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'ไม่ระบุ'
                }
                message={request.customer_message}
              />
            );
          })
        ) : (
          <Text style={tw`text-center text-gray-500 mt-4`}>ไม่มีงาน</Text>
        )}
      </ScrollView>
    </View>
  );
}

