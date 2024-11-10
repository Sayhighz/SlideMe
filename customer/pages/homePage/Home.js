import React from 'react'
import { Text , View , TouchableOpacity} from 'react-native'
import { Card } from 'react-native-paper'
import Order from '../detailOrder/Order'
import tw from 'twrnc'



function Home({ navigation }) {
  return (
    <>
    <View style={tw`flex items-center`}>
      

      <TouchableOpacity  style={tw`mt-4`} onPress={() => navigation.navigate("Order")}>
      <Card style={tw`bg-white rounded-lg w-80 h-40 flex items-center justify-center border`}>
      <Text style={tw`text-3xl font-bold `}> Search </Text>
        </Card>
        </TouchableOpacity>
      
      <Card style={tw`bg-white rounded-lg w-80 h-40 mt-4 flex items-center justify-center border`}>
      <Text style={tw`text-3xl font-bold `}></Text>
        </Card>
      
    </View>
    </>
  )
}

export default Home
