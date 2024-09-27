import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import StatusItem from '../components/StatusItem'; // ปรับเส้นทางให้ตรงตามที่คุณจัดเก็บไฟล์
import { useFonts } from 'expo-font';
import Ionicons from 'react-native-vector-icons/Ionicons';

import tw from 'twrnc'; // import twrnc

const HomePage = ({ username }) => {
    const [fontsLoaded] = useFonts({
        'Mitr-Regular': require('../assets/fonts/Mitr-Regular.ttf'), // ใช้ฟอนต์ที่คุณต้องการ
        'Mitr-Medium': require('../assets/fonts/Mitr-Medium.ttf'), // ฟอนต์หนา
      });
    
      // หากฟอนต์ยังโหลดไม่เสร็จให้แสดงตัวโหลด
      if (!fontsLoaded) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/profile.jpeg')} // เปลี่ยนเป็นเส้นทางที่ถูกต้องไปยังรูปโปรไฟล์
          style={styles.profileImage}
        />
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>สวัสดี !</Text>
        <Text style={styles.username}>Kunatip{username}</Text>
      </View>
      </View>
        <View style={styles.divider} />
      {/* ส่วนสถานะ */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusHeader}>สถานะของคุณ</Text>
        <StatusItem title="รายได้วันนี้" amount="500 ฿" icon="cash" />
        <StatusItem title="เครดิตรับงาน" amount="10 ฿" icon="wallet-outline" />
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Text >Home</Text>
      </View>

      <View style={tw` justify-center items-center bg-red-900`}>
        <Text style={tw`text-white text-lg`}>tailwind ใช้กับ expo ได้ ไอกาย</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'flex-start',
    alignItems: 'left',
},
header: {
    marginVertical: 10,
    flexDirection: 'row',
    fontFamily: 'Mitr-Medium',
},
profileImage: {
    width: 70, // ขนาดของรูปโปรไฟล์
    height: 70,
    paddingHorizontal: 10,
    borderRadius: 50, // ทำให้รูปโปรไฟล์เป็นวงกลม
},
greetingContainer: {
    alignItems: 'left', // จัดกลาง
    marginVertical: 5,
    marginLeft: 15,
},
greeting: {
    fontSize: 18,
    color: 'gray',
    fontFamily: 'Mitr-Medium',
},
username: {
    fontSize: 30,
    color: '#60B876',
    fontWeight: 'bold',
},
statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
},

statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
},
statusContainer: {
    width: '100%',
    marginVertical: 5,
},
  statusHeader: {
    fontSize: 15,
    color: '#333333',
    margin: 10,
    fontFamily: 'Mitr-Medium',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#d3d3d3', // สีของเส้นกั้น
    width: '100%', // กว้างเต็มหน้าจอ
  },
  content: {
    // สไตล์สำหรับเนื้อหาหลัก
  },
});

export default HomePage;
