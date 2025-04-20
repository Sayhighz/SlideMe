import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Platform, Alert, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { IP_ADDRESS } from "../../config";
import { 
  PRIMARY_COLOR, 
  formatThaiDate, 
  formatDistance, 
  formatDuration, 
  formatNumberWithCommas, 
  hasPhotos 
} from './utils';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';

const DetailModal = ({ 
  visible, 
  item, 
  onClose, 
  onViewPhoto,
  onRate,
  onViewStatus
}) => {
  if (!item) return null;
  
  const formattedPrice = item.offered_price_formatted || 
                         (item.offered_price ? `฿${formatNumberWithCommas(item.offered_price)}` : "฿0");
  
  // Photo section
  const renderPhotoService = () => {
    const beforePhotos = item.photos_before_service || [];
    const afterPhotos = item.photos_after_service || [];
    
    if (beforePhotos.length === 0 && afterPhotos.length === 0) {
      return null;
    }
    // console.log(beforePhotos[0].url)

    // Map position to Thai text
    const getPositionText = (position) => {
      switch (position?.toLowerCase()) {
        case 'front': return 'ด้านหน้า';
        case 'back': return 'ด้านหลัง';
        case 'left': return 'ด้านซ้าย';
        case 'right': return 'ด้านขวา';
        default: return position || '';
      }
    };

    
    return (
      <View style={tw`mb-6`}>
        <Text style={[styles.sectionTitle, tw`mb-3 text-gray-800`]}>รูปภาพบริการ</Text>
        
        {beforePhotos.length > 0 && (
          <View style={tw`mb-4`}>
            <Text style={[styles.customFont, tw`text-gray-600 mb-2`]}>รูปภาพก่อนให้บริการ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {beforePhotos.map((photo, index) => (
                <TouchableOpacity
                  key={`before-${index}`}
                  style={tw`mr-3`}
                  onPress={() => onViewPhoto('before', index)}
                >
                  <Image
                    source={{ 
                      uri: photo && photo.url 
                        ? `http://${IP_ADDRESS}:4000/api/v1${photo.url}`
                        : (photo && typeof photo === 'string'
                          ? (`http://${IP_ADDRESS}:4000/api/v1${photo}`)
                          : `http://${IP_ADDRESS}/placeholder-image.jpg`)
                    }}
                    style={[tw`w-24 h-24 rounded-lg`, styles.photoThumbnail]}
                    resizeMode="cover"
                  />
                  <View style={tw`absolute top-1 right-1 bg-black/50 rounded-full w-5 h-5 items-center justify-center`}>
                    <Text style={tw`text-white text-xs`}>{index + 1}</Text>
                  </View>
                  {photo && photo.position && (
                    <View style={tw`absolute bottom-1 left-1 right-1 bg-black/50 rounded-sm px-1 py-0.5`}>
                      <Text style={tw`text-white text-xs text-center`}>{getPositionText(photo.position)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {afterPhotos.length > 0 && (
          <View>
            <Text style={[styles.customFont, tw`text-gray-600 mb-2`]}>รูปภาพหลังให้บริการ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {afterPhotos.map((photo, index) => (
                <TouchableOpacity
                  key={`after-${index}`}
                  style={tw`mr-3`}
                  onPress={() => onViewPhoto('after', index)}
                >
                  <Image
                    source={{ 
                      uri: photo && typeof photo === 'object' && photo.url 
                        ? `http://${IP_ADDRESS}:4000/api/v1${photo.url}`
                        : (photo && typeof photo === 'string'
                          ? (photo.startsWith('http') ? photo : `http://${IP_ADDRESS}:4000/api/v1${photo.url}`)
                          : `http://${IP_ADDRESS}:4000/api/v1${photo.url}`)
                    }}
                    style={[tw`w-24 h-24 rounded-lg`, styles.photoThumbnail]}
                    resizeMode="cover"
                  />
                  <View style={tw`absolute top-1 right-1 bg-black/50 rounded-full w-5 h-5 items-center justify-center`}>
                    <Text style={tw`text-white text-xs`}>{index + 1}</Text>
                  </View>
                  {photo && photo.position && (
                    <View style={tw`absolute bottom-1 left-1 right-1 bg-black/50 rounded-sm px-1 py-0.5`}>
                      <Text style={tw`text-white text-xs text-center`}>{getPositionText(photo.position)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
                  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`max-h-5/6 w-11/12 max-w-md`}>
          <ScrollView 
            style={[tw`bg-white rounded-2xl`, styles.modalShadow]} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`p-5`}
            bounces={false}
          >
            {/* Header with status */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <View style={tw`flex-row items-center`}>
                <Text style={[styles.modalTitle, tw`text-xl text-gray-800 font-bold`]}>
                  รายละเอียดการเดินทาง
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name="close-circle" size={28} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>

            {/* Status Badge */}
            <View style={tw`mb-4`}>
              <StatusBadge status={item.status} />
            </View>

            {/* Service type */}
            <View style={tw`mb-4 flex-row items-center`}>
              <View style={tw`w-10 items-center`}>
                <Ionicons name="car" size={22} color={PRIMARY_COLOR} />
              </View>
              <View>
                <Text style={[styles.customFont, tw`text-gray-500 text-xs`]}>ประเภทบริการ</Text>
                <Text style={[styles.sectionTitle, tw`text-gray-800`]}>
                  {item.vehicletype_name || "ไม่ระบุ"}
                </Text>
              </View>
            </View>

            {/* Date and Time */}
            <View style={tw`mb-4 flex-row items-center`}>
              <View style={tw`w-10 items-center`}>
                <Ionicons name="calendar" size={22} color={PRIMARY_COLOR} />
              </View>
              <View>
                <Text style={[styles.customFont, tw`text-gray-500 text-xs`]}>วันและเวลา</Text>
                <Text style={[styles.customFont, tw`text-gray-800`]}>
                  {formatThaiDate(item.request_date)} {item.request_time || ""}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={tw`border-t border-gray-200 my-3`} />

            {/* Location route */}
            <View style={tw`mb-5 mt-2`}>
              <Text style={[styles.sectionTitle, tw`mb-3 text-gray-800`]}>เส้นทาง</Text>
              
              <View style={tw`flex-row mb-3`}>
                <View style={tw`items-center mr-3`}>
                  <View style={tw`h-6 w-6 rounded-full bg-blue-500 items-center justify-center`}>
                    <View style={tw`h-2 w-2 rounded-full bg-white`} />
                  </View>
                  <View style={tw`h-14 border-l-2 border-dashed border-gray-300 my-1 ml-[2px]`} />
                  <View style={tw`h-6 w-6 rounded-full bg-red-500 items-center justify-center`}>
                    <View style={tw`h-2 w-2 rounded-full bg-white`} />
                  </View>
                </View>
                
                <View style={tw`flex-1`}>
                  <View style={tw`mb-3`}>
                    <Text style={[styles.customFont, tw`text-gray-500 text-xs`]}>ต้นทาง</Text>
                    <Text style={[styles.customFont, tw`text-gray-800`]} numberOfLines={2}>
                      {item.location_from || "ไม่ระบุ"}
                    </Text>
                  </View>
                  
                  <View style={tw`mt-auto`}>
                    <Text style={[styles.customFont, tw`text-gray-500 text-xs`]}>ปลายทาง</Text>
                    <Text style={[styles.customFont, tw`text-gray-800`]} numberOfLines={2}>
                      {item.location_to || "ไม่ระบุ"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Trip details */}
            <View style={tw`mb-5`}>
              <Text style={[styles.sectionTitle, tw`mb-3 text-gray-800`]}>รายละเอียดการเดินทาง</Text>
              
              <View style={tw`bg-gray-50 p-4 rounded-xl`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={[styles.customFont, tw`text-gray-500`]}>ระยะทาง:</Text>
                  <Text style={[styles.customFont, tw`text-gray-800 font-medium`]}>
                    {formatDistance(item.distance_km)}
                  </Text>
                </View>
                
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={[styles.customFont, tw`text-gray-500`]}>เวลาเดินทาง:</Text>
                  <Text style={[styles.customFont, tw`text-gray-800 font-medium`]}>
                    {formatDuration(item.travel_time_minutes)}
                  </Text>
                </View>
                
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={[styles.customFont, tw`text-gray-500`]}>ทะเบียนรถ:</Text>
                  <Text style={[styles.customFont, tw`text-gray-800 font-medium`]}>
                    {item.license_plate || "ไม่ระบุ"}
                  </Text>
                </View>
                
                <View style={tw`flex-row justify-between`}>
                  <Text style={[styles.customFont, tw`text-gray-500`]}>คนขับ:</Text>
                  <Text style={[styles.customFont, tw`text-gray-800 font-medium`]}>
                    {item.driver_name || "ไม่ระบุ"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Service Photos */}
            {renderPhotoService()}

            {/* Pricing */}
            <View style={tw`mb-5`}>
              <Text style={[styles.sectionTitle, tw`mb-3 text-gray-800`]}>ค่าบริการ</Text>
              <View style={tw`bg-gray-50 p-4 rounded-xl`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={[styles.customFont, tw`text-gray-700`]}>ราคาทั้งหมด</Text>
                  <Text style={[styles.priceText, tw`text-xl text-gray-800 font-bold`]}>
                    {formattedPrice}
                  </Text>
                </View>
                {item.receipt_id && (
                  <View style={tw`flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200`}>
                    <Text style={[styles.customFont, tw`text-gray-500 text-xs`]}>เลขที่ใบเสร็จ</Text>
                    <Text style={[styles.customFont, tw`text-gray-500 text-xs font-medium`]}>{item.receipt_id}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Rating */}
            {item.status === "completed" && (
              <View style={tw`mb-6`}>
                <Text style={[styles.sectionTitle, tw`mb-3 text-gray-800`]}>การให้คะแนน</Text>
                <View style={tw`flex-row items-center justify-between bg-gray-50 p-4 rounded-xl`}>
                  <Text style={[styles.customFont, tw`text-gray-700`]}>คะแนนจากคุณ</Text>
                  <View style={tw`flex-row`}>
                    <RatingStars rating={item.rating} size={18} />
                  </View>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={tw`flex-row justify-between mt-2`}>
              <TouchableOpacity
                style={[
                  tw`flex-1 mr-2 rounded-xl py-3 px-4 border border-[${PRIMARY_COLOR}]`,
                  styles.buttonShadow
                ]}
                onPress={onClose}
              >
                <Text style={[styles.customFont, tw`text-[${PRIMARY_COLOR}] text-center font-bold`]}>ปิด</Text>
              </TouchableOpacity>
              
              {item.status === "completed" && !item.rating && (
                <TouchableOpacity
                  style={[
                    tw`flex-1 ml-2 rounded-xl py-3 px-4 bg-[${PRIMARY_COLOR}]`,
                    styles.buttonShadow
                  ]}
                  onPress={() => onRate(item.request_id)}
                >
                  <Text style={[styles.customFont, tw`text-white text-center font-bold`]}>ให้คะแนน</Text>
                </TouchableOpacity>
              )}
              
              {(item.status !== "completed" && item.status !== "cancelled") && (
                <TouchableOpacity
                  style={[
                    tw`flex-1 ml-2 rounded-xl py-3 px-4 bg-[${PRIMARY_COLOR}]`,
                    styles.buttonShadow
                  ]}
                  onPress={onViewStatus}
                >
                  <Text style={[styles.customFont, tw`text-white text-center font-bold`]}>ดูสถานะ</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
    fontSize: 16,
  },
  priceText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  modalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  modalShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  photoThumbnail: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default DetailModal;