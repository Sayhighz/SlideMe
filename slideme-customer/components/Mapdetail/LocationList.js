import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Animated 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const LocationList = ({ locations = [], onSelectLocation }) => {
  // เนื่องจาก mockData.js ว่างเปล่า สร้างข้อมูลตัวอย่างสำหรับการแสดงผล
  const sampleLocations = [
    {
      id: '1',
      name: 'สนามบินสุวรรณภูมิ',
      address: 'ถนนเทพรัตน ตำบลราชาเทวะ อำเภอบางพลี จังหวัดสมุทรปราการ',
      type: 'airport',
      distance: '0.5 กม.'
    },
    {
      id: '2',
      name: 'สยามพารากอน',
      address: 'ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร',
      type: 'mall',
      distance: '1.2 กม.'
    },
    {
      id: '3',
      name: 'สถานีรถไฟหัวลำโพง',
      address: 'ถนนรองเมือง แขวงรองเมือง เขตปทุมวัน กรุงเทพมหานคร',
      type: 'station',
      distance: '2.7 กม.'
    },
    {
      id: '4',
      name: 'จตุจักร',
      address: 'ถนนกำแพงเพชร แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร',
      type: 'market',
      distance: '5.1 กม.'
    },
  ];

  // เลือกไอคอนตามประเภทสถานที่
  const getIconByType = (type) => {
    switch (type) {
      case 'airport':
        return 'flight';
      case 'mall':
        return 'shopping-bag';
      case 'station':
        return 'train';
      case 'market':
        return 'store';
      default:
        return 'place';
    }
  };

  // สำหรับการแสดงรายการ
  const renderItem = ({ item, index }) => {
    // ใช้ข้อมูลจริงหากมี หรือใช้ข้อมูลตัวอย่างถ้าไม่มี
    const location = locations.length > 0 ? locations[index] : item;
    
    return (
      <TouchableOpacity
        style={[
          tw`mb-3 p-3 rounded-xl bg-white flex-row items-center`,
          Platform.OS === 'ios' ? styles.iosShadow : styles.androidShadow,
        ]}
        onPress={() => onSelectLocation(location)}
        activeOpacity={0.7}
      >
        <View style={[tw`mr-3`, styles.locationIcon]}>
          <MaterialIcons
            name={getIconByType(location.type)}
            size={20}
            color="#3B82F6"
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={[styles.globalText, tw`text-base font-medium text-gray-800`]}>
            {location.name}
          </Text>
          <Text style={[styles.globalText, tw`text-xs text-gray-500 mt-1`]} numberOfLines={1}>
            {location.address}
          </Text>
        </View>
        <View style={tw`ml-2`}>
          <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
            {location.distance}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Header สำหรับรายการ
  const ListHeader = () => (
    <View style={tw`mb-3 px-2`}>
      <Text style={[styles.globalText, tw`text-base font-medium text-gray-700`]}>
        สถานที่ใกล้เคียง
      </Text>
    </View>
  );

  // ถ้าไม่มีข้อมูลใช้ข้อมูลตัวอย่าง
  const dataToRender = locations.length > 0 ? locations : sampleLocations;

  return (
    <View style={tw`flex-1`}>
      <ListHeader />
      <FlatList
        data={dataToRender}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={tw`bg-gray-50 rounded-xl p-2`}
        contentContainerStyle={tw`pb-2`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  locationIcon: {
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  androidShadow: {
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  }
});

export default LocationList;