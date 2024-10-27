
import React from 'react';
import { View, Text, TextInput,  TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import tw from 'twrnc';

const recentLocations = [
  { id: '1', name: 'The Grand Palace', address: 'Na Phra Lan Rd, Phra Borom Maha Ratchawang' },
  { id: '2', name: 'Bus Stop Thammasat University', address: 'Na Phra That Rd, Phra Borom Maha Ratchawang' },
  { id: '3', name: 'MRT Sanam Chai', address: 'Sanam Chai Rd, Phra Borom Maha Ratchawang' },
];

const rideOptions = [
  { id: '1', label: 'Advance Booking', icon: 'calendar', color: '#A5DFF3' },
  { id: '2', label: '', icon: 'motorcycle', color: '#C1E7BE' },
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
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Where do you want to take the Slide Car</Text>

      {/* Location Search */}
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
      <View style={styles.searchBar}>
        <MaterialIcons name="place" size={24} color="red" />  
          <Text style={styles.nowText}>Now</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="black" />
      </View>
        </TouchableOpacity>

      {/* Recent Locations */}
      {/* <FlatList
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
      /> */}

      {/* Ride Options */}
      <Text style={styles.sectionTitle}>Rides for your every need</Text>
      <View style={[styles.optionsContainer , tw`flex-1 items-center`]} >
        {rideOptions.map((option) => (
          <TouchableOpacity key={option.id} style={[styles.optionCard, { backgroundColor: option.color } , tw`items-center justify-center mt-4 w-70 h-20`]}>
            <FontAwesome5 name={option.icon} size={24} color="black" />
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
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 10 },
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
  
  optionText: { marginLeft: 10, fontSize: 16 },
});
