import React from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import tw from "twrnc"; // import twrnc

const HistoryPage = () => {
  return (
    <SafeAreaView>
    <View style={tw``}>
      <View style={tw`flex flex-row justify-around`}>
        <View style={tw`w-2/8 bg-slate-400 rounded-lg`}>
          <Button style={tw``} title="กำลังดำเนินการ"></Button>
        </View>
        <View style={tw`w-2/8 bg-slate-400 rounded-lg`}>
          <Button style={tw``} title="ที่บันทึกไว้"></Button>
        </View>
        <View style={tw`w-2/8 bg-slate-400 rounded-lg`}>
          <Button style={tw``} title="ประวัติ"></Button>
        </View>
      </View>
      <View style={tw`flex flex-col`}>
        
      </View>
    </View>
    </SafeAreaView>
  );
};

export default HistoryPage;
