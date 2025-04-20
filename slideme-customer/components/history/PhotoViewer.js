import React from 'react';
import { Modal, View, Image, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { IP_ADDRESS } from "../../config";

const PhotoViewer = ({ 
  visible, 
  onClose, 
  photos, 
  currentIndex, 
  onPrevious, 
  onNext, 
  photoType 
}) => {
  if (!photos || photos.length === 0) return null;
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const currentPhoto = photos[currentIndex];
  
  // Safely handle photo URI
  let photoUri = `http://${IP_ADDRESS}/placeholder-image.jpg`;
  
  if (currentPhoto) {
    if (typeof currentPhoto === 'object' && currentPhoto.url) {
      photoUri = `http://${IP_ADDRESS}${currentPhoto.url}`;
    } else if (typeof currentPhoto === 'string') {
      photoUri = currentPhoto.startsWith('http') 
        ? currentPhoto 
        : `http://${IP_ADDRESS}/${currentPhoto}`;
    }
  }

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
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black justify-center items-center`}>
        {/* Header controls */}
        <View style={tw`absolute top-10 left-0 right-0 flex-row justify-between px-4 z-10`}>
          <TouchableOpacity
            style={tw`p-3 rounded-full bg-black/50`}
            onPress={onClose}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={tw`flex-row items-center bg-black/50 rounded-full px-4 py-2`}>
            <Text style={[styles.customFont, tw`text-white`]}>
              {photoType === 'before' ? 'ก่อนให้บริการ' : 'หลังให้บริการ'} 
              {` ${currentIndex + 1}/${photos.length}`}
            </Text>
            {currentPhoto && currentPhoto.position && (
              <Text style={[styles.customFont, tw`text-white text-xs ml-2 bg-gray-700 px-2 py-0.5 rounded-full`]}>
                {getPositionText(currentPhoto.position)}
              </Text>
            )}
          </View>
        </View>
        
        {/* Main image */}
        <View style={{ width: screenWidth, height: screenHeight * 0.7, justifyContent: 'center' }}>
          <Image
            source={{ uri: photoUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
        
        {/* Caption/Filename */}
        {currentPhoto && currentPhoto.filename && (
          <View style={tw`absolute bottom-20 left-4 right-4 bg-black/50 rounded-lg px-4 py-2`}>
            <Text style={[styles.customFont, tw`text-white text-center text-xs`]}>
              {currentPhoto.filename}
            </Text>
          </View>
        )}
        
        {/* Navigation buttons */}
        <View style={tw`absolute left-0 right-0 bottom-10 flex-row justify-between px-4`}>
          {/* Previous button */}
          {currentIndex > 0 ? (
            <TouchableOpacity
              style={tw`p-3 rounded-full bg-black/50`}
              onPress={onPrevious}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          
          {/* Next button */}
          {currentIndex < photos.length - 1 ? (
            <TouchableOpacity
              style={tw`p-3 rounded-full bg-black/50`}
              onPress={onNext}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="chevron-forward" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
});

export default PhotoViewer;