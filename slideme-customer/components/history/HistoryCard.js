import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { PRIMARY_COLOR } from './utils';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';
import { formatThaiDate, formatNumberWithCommas, hasPhotos } from './utils';

const HistoryCard = ({ item, onPress }) => {
  const formattedPrice = item.offered_price_formatted || 
                         (item.offered_price ? `฿${formatNumberWithCommas(item.offered_price)}` : "฿0");

  return (
    <TouchableOpacity 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      style={tw`px-4 pt-2`}
    >
      <View style={[
        tw`bg-white rounded-xl p-4 mb-3`,
        styles.cardShadow
      ]}>
        {/* Header section */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3`}>
              <Ionicons name="car-outline" size={20} color={PRIMARY_COLOR} />
            </View>
            <View>
              <Text style={[tw`text-base font-bold text-gray-800`, styles.boldFont]} numberOfLines={1}>
                {item.vehicletype_name || "ไม่ระบุ"}
              </Text>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="calendar-outline" size={14} color="#6c757d" style={tw`mr-1`} />
                <Text style={[tw`text-xs text-gray-600`, styles.customFont]}>
                  {formatThaiDate(item.request_date)} {item.request_time || ""}
                </Text>
              </View>
            </View>
          </View>
          
          <StatusBadge status={item.status} />
        </View>
        
        {/* Route info */}
        <View style={tw`mb-3`}>
          <View style={tw`flex-row items-center mb-1`}>
            <View style={tw`w-8 items-center`}>
              <View style={tw`h-5 w-5 rounded-full bg-blue-500 items-center justify-center`}>
                <View style={tw`h-2 w-2 rounded-full bg-white`} />
              </View>
            </View>
            <Text style={[tw`text-sm text-gray-700 flex-1`, styles.customFont]} numberOfLines={1}>
              {item.location_from ? item.location_from.split(',')[0] : "ไม่ระบุต้นทาง"}
            </Text>
          </View>
          
          <View style={tw`flex-row items-center pl-4 ml-4`}>
            <View style={tw`border-l-2 border-dashed border-gray-300 h-4 -ml-6`} />
          </View>
          
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-8 items-center`}>
              <View style={tw`h-5 w-5 rounded-full bg-red-500 items-center justify-center`}>
                <View style={tw`h-2 w-2 rounded-full bg-white`} />
              </View>
            </View>
            <Text style={[tw`text-sm text-gray-700 flex-1`, styles.customFont]} numberOfLines={1}>
              {item.location_to ? item.location_to.split(',')[0] : "ไม่ระบุปลายทาง"}
            </Text>
          </View>
        </View>
        
        {/* Driver info if available */}
        {item.driver_name && (
          <View style={tw`mb-3 flex-row items-center`}>
            <View style={tw`w-8 items-center`}>
              <Ionicons name="person" size={16} color={PRIMARY_COLOR} />
            </View>
            <Text style={[tw`text-sm text-gray-700 flex-1`, styles.customFont]} numberOfLines={1}>
              {item.driver_name}
            </Text>
            {item.license_plate && (
              <View style={tw`bg-gray-100 px-2 py-1 rounded-md`}>
                <Text style={[tw`text-xs text-gray-700`, styles.customFont]}>
                  {item.license_plate}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Photo indicator if service has photos */}
        {hasPhotos(item) && (
          <View style={tw`mb-2`}>
            <View style={tw`self-start flex-row items-center bg-gray-100 rounded-full px-3 py-1`}>
              <Ionicons name="images-outline" size={14} color={PRIMARY_COLOR} />
              <Text style={[tw`text-xs text-gray-700 ml-1`, styles.customFont]}>
                มีรูปภาพบริการ
              </Text>
            </View>
          </View>
        )}
        
        {/* Price and rating info */}
        <View style={tw`flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100`}>
          <Text style={[tw`text-lg font-bold text-gray-800`, styles.priceText]}>
            {formattedPrice}
          </Text>
          {item.status === "completed" && (
            <RatingStars rating={item.rating} size={16} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  boldFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Medium' : 'Mitr-Medium',
  },
  priceText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Medium' : 'Mitr-Medium',
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default HistoryCard;