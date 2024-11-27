import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import { useNavigation } from "@react-navigation/native";

const AddMethod = ({ route }) => {
  const { onRefresh } = route.params || {};
  const { userData } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [paymentType, setPaymentType] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const navigation = useNavigation();

  const paymentOptions = [
    { label: "บัตรเครดิต", value: "credit_card" },
    { label: "บัตรเดบิต", value: "debit_card" },
    { label: "PayPal", value: "paypal" },
    { label: "ธนาคาร", value: "bank_transfer" },
    { label: "อื่นๆ", value: "other" },
  ];

  const handleExpirationDateChange = (input) => {
    let formattedInput = input.replace(/\D/g, "");
    if (formattedInput.length > 2) {
      formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(2)}`;
    }
    setExpirationDate(formattedInput);
  };

  const handleSubmit = async () => {
    if (!paymentType || !accountName || !accountNumber || !expirationDate) {
      Alert.alert("Error", "โปรดกรอกข้อมูลให้ครบ");
      return;
    }

    const payload = {
      user_id: userData.user_id,
      payment_type: paymentType,
      card_number: accountNumber,
      account_name: accountName,
      expiration_date: expirationDate,
    };

    try {
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/add_payment_method`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "บันทึกช่องทางการชำระเงินสําเร็จ");
        if (onRefresh) onRefresh();
        navigation.goBack()
      } else {
        Alert.alert("Error", "บันทึกช่องทางการชำระเงินไม่สําเร็จ");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
    }
  };
  

  const renderPaymentOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setPaymentType(item.value);
        setModalVisible(false);
      }}
      style={tw`p-4 border-b border-gray-200`}
    >
      <Text style={[tw`text-lg`, styles.customFont]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-5 bg-gray-100 mt-17`}>
      <Text style={[tw`text-2xl mb-5`, styles.customFont]}>เพิ่มช่องทางการชำระเงิน</Text>

      <Text style={[tw`text-lg mt-2`, styles.customFont]}>ประเภท</Text>
      <TouchableOpacity
        style={tw`border border-gray-300 rounded mt-1 p-3 flex-row justify-between items-center`}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[tw`text-lg`, styles.customFont]}>
          {paymentType ? paymentOptions.find((opt) => opt.value === paymentType)?.label : "เลือกประเภทการชำระเงิน"}
        </Text>
        <Icon name="chevron-down" size={16} />
      </TouchableOpacity>

      <Text style={[tw`text-lg mt-4`, styles.customFont]}>ชื่อบัญชี</Text>
      <TextInput
        style={[tw`border border-gray-300 p-2 rounded mt-1`, styles.input]}
        placeholder="ชื่อบัญชี"
        value={accountName}
        onChangeText={setAccountName}
        placeholderTextColor="#9CA3AF"
      />

      <Text style={[tw`text-lg mt-4`, styles.customFont]}>หมายเลขบัญชี</Text>
      <TextInput
        style={[tw`border border-gray-300 p-2 rounded mt-1`, styles.input]}
        placeholder="เลขบัญชี"
        keyboardType="numeric"
        maxLength={5}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholderTextColor="#9CA3AF"
      />

      <Text style={[tw`text-lg mt-4`, styles.customFont]}>วันหมดอายุ</Text>
      <TextInput
        style={[tw`border border-gray-300 p-2 rounded mt-1`, styles.input]}
        placeholder="MM/YY"
        value={expirationDate}
        onChangeText={handleExpirationDateChange}
        maxLength={6}
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        style={tw`bg-green-600 p-3 rounded mt-5`}
        onPress={handleSubmit}
      >
        <Text style={[tw`text-white text-center text-lg`, styles.customFont]}>บันทึก</Text>
      </TouchableOpacity>

      {/* Modal for selecting payment type */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-lg w-10/12`}>
            <FlatList
              data={paymentOptions}
              renderItem={renderPaymentOption}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={tw`p-4 bg-gray-300 rounded-b-lg`}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[tw`text-center text-lg`, styles.customFont]}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: "Mitr-Regular",
  },
  input: {
    fontFamily: "Mitr-Regular",
    height: Platform.select({ ios: 40, android: 50 }),
    color: "#000",
  },
});

export default AddMethod;
