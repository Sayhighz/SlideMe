// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { Card } from 'react-native-paper';
// import tw from 'twrnc';

// const Order = () => {
//   return (
//     <View style={tw`flex items-center`}>
//       <Card style={tw`w-80 h-25 flex items-center justify-center mt-4`}>   
//         <Text>ต้นทาง</Text>
//       </Card>
//       <Card style={tw`w-80 h-25 flex items-center justify-center mt-4`}>   
//         <Text>ปลายทาง</Text>
//       </Card>
//       <Card style={tw`w-80 h-15 flex items-center justify-center mt-4`}>   
//         <Text>ประเภทของรถ</Text>
//       </Card>
//       <Card style={tw`w-80 h-15 flex items-center justify-center mt-4`}>   
//         <Text>ประเภทการเรียก</Text>
//       </Card>
//       <Card style={tw`w-80 h-40 flex items-center justify-center mt-4`}>   
//         <Text>รายละเอียดเพิ่มเติม</Text>
//       </Card>
//     </View>
//   );
// };

// export default Order;

// const styles = StyleSheet.create({});

// Import necessary libraries
import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import tw from 'twrnc';

const recentLocations = [
  { id: '1', name: 'The Grand Palace', address: 'Na Phra Lan Rd, Phra Borom Maha Ratchawang' },
  { id: '2', name: 'Bus Stop Thammasat University', address: 'Na Phra That Rd, Phra Borom Maha Ratchawang' },
  { id: '3', name: 'MRT Sanam Chai', address: 'Sanam Chai Rd, Phra Borom Maha Ratchawang' },
];

const rideOptions = [
  { id: '1', label: 'Advance Booking', icon: 'calendar-today', color: '#A5DFF3' },
  { id: '2', label: 'Saver Bike', icon: 'motorcycle', color: '#C1E7BE' },
  { id: '3', label: 'Driver for your car', icon: 'car', color: '#F8E3A3' },
  { id: '4', label: 'Rent by the hour', icon: 'person', color: '#FAD4A3' },
];

export default function Order({ navigation }) {
  return (
    <View style={tw`flex-1 p-5 bg-green-100`}>
      {/* Header Section */}
      <View style={tw`flex-row items-center mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transport</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Wherever you're going, let's get you there!</Text>

      {/* Location Search */}
      <View style={styles.searchBar}>
        <MaterialIcons name="place" size={24} color="red" />
        <TextInput style={styles.input} placeholder="Where to?" />
        <TouchableOpacity>
          <Text style={styles.nowText}>Now</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Recent Locations */}
      <FlatList
        data={recentLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <FontAwesome name="history" size={20} color="#87CEEB" />
            <View style={styles.locationText}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationAddress}>{item.address}</Text>
            </View>
          </View>
        )}
      />

      {/* Ride Options */}
      <Text style={styles.sectionTitle}>Rides for your every need</Text>
      <View style={styles.optionsContainer}>
        {rideOptions.map((option) => (
          <TouchableOpacity key={option.id} style={[styles.optionCard, { backgroundColor: option.color }]}>
            <MaterialIcons name={option.icon} size={24} color="black" />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2FFF3' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  input: { flex: 1, fontSize: 16, marginLeft: 10 },
  nowText: { fontSize: 16, color: 'gray', marginRight: 5 },
  locationItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  locationText: { marginLeft: 10 },
  locationName: { fontSize: 16, fontWeight: 'bold' },
  locationAddress: { fontSize: 14, color: 'gray' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  optionText: { marginLeft: 10, fontSize: 16 },
});
