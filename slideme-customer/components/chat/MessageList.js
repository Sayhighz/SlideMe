import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import MessageItem from "./MessageItem";

const MessageList = ({ 
  messages, 
  flatListRef, 
  handleScroll, 
  atBottom, 
  user_id, 
  user_type,
  scrollToBottom 
}) => {
  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={messages}
        ref={flatListRef}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <MessageItem 
            message={item.message} 
            isCurrentUser={
              item.sender === user_id || 
              item.sender_type === user_type ||
              item.sender_id === user_id
            } 
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={tw`flex-1 px-4`}
        contentContainerStyle={tw`py-2`}
      />

      {/* Scroll to Bottom Icon */}
      {!atBottom && (
        <TouchableOpacity
          style={tw`absolute bottom-4 right-4 bg-gray-700 p-3 rounded-full`}
          onPress={scrollToBottom}
        >
          <Icon name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MessageList;