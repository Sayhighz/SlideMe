
import React from 'react';
import { View, Text, TextInput,  TouchableOpacity, StyleSheet , Image} from 'react-native';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import tw, { style } from 'twrnc';


export default function Order({ navigation }) {

  const route = useRoute();
  const [origin,setOrigin] = useState(null)
  const [destination,setDestination] = useState(null)
  const [confirmOrigin, setConfirmOrigin] = useState(null);
  const [confirmDestination, setConfirmDestination] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.origin) {
        setOrigin(route.params.origin);
        console.log("ต้นทาง = ",origin)
      }      
      if (route.params?.destination) {
        setDestination(route.params.destination);
        console.log("ปลายทาง = ",destination)
      }
      if (route.params?.confirmOrigin) {
        setConfirmOrigin(route.params.confirmOrigin);
        console.log("ต้นทาง = ",confirmOrigin)
      }
      if (route.params?.confirmDestination) {
        setConfirmDestination(route.params.confirmDestination);
        console.log("ปลายทาง = ",confirmDestination)
      }
    }, [route.params])
  );

  const handleLocationSelection = useCallback((selectedOrigin, selectedDestination) => {
    setOrigin(selectedOrigin);
    setDestination(selectedDestination);
  }, []);

  return (
    <View style={tw`flex-1 p-5 `}>
        {/* <Image /> */}
      {/* Header Section */}
      <View style={tw`flex-row items-center `}>
    
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Where do you want to take the Slide Car</Text>

      {/* Location Search */}
        <TouchableOpacity onPress={() => navigation.navigate('Inputmap')}>
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
      <Text style={styles.sectionTitle}></Text>
      {/* <View style={[styles.optionsContainer , tw`flex-1 items-center`]} >
        {rideOptions.map((option) => (
          <TouchableOpacity key={option.id} style={[styles.optionCard, { backgroundColor: option.color } , tw`items-center justify-center mt-4 w-70 h-20`]}>
            <FontAwesome5 name={option.icon} size={24} color="black" />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

     <View style={tw`flex-1 items-center`}>
    <View style={[styles.optionsContainer]}>
        <TouchableOpacity style={[styles.optionCard , tw`items-center justify-center mt-4 w-70 h-20 bg-[white]`]}>
        <FontAwesome5 name={'calendar'} size={24} color="black"/>
        <Text>Booking</Text>
        </TouchableOpacity>
    </View>

    <View style={[styles.optionsContainer]}>
        <TouchableOpacity style={[styles.optionCard , tw`items-center justify-center mt-4 w-70 h-20 bg-[white]`]}>
        <FontAwesome5 name={'car'} size={24} color="black"/>
        <Text>Category</Text>
        </TouchableOpacity>
    </View>

    <View style={[styles.optionsContainer]}>
        <TouchableOpacity style={[styles.optionCard , tw`items-center justify-center mt-4 w-70 h-40 bg-[white]`]}>
        {/* <FontAwesome5 name={''} size={24} color="black"/> */}
        <Text>More Detail ... </Text>

        </TouchableOpacity>
    </View>
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
