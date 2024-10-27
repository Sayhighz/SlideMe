import React from 'react';
import { View, Text, TouchableOpacity,ScrollView  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // ใช้ FontAwesome หรือตามที่ต้องการ
import SignupPageStyle from './SignupPageStyle';

const SignupPage = ({ onBack }) => {
    return (
        <ScrollView>
        <View style={SignupPageStyle.newContentContainer}>
            {/* Back button in top-left corner */}
            {/* <TouchableOpacity style={SignupPageStyle.topLeftBackButton} onPress={onBack}>
                <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity> */}

            <Text style={SignupPageStyle.newContentText}>ยินดีต้อนรับสู่ SLIDE ME!</Text>
            <View style={SignupPageStyle.buttonContainer}>
                <TouchableOpacity style={SignupPageStyle.backButton}>
                    <Icon name="facebook" size={20} color="#fff" style={{ marginLeft: 10 }} />
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={SignupPageStyle.backButton} onPress={() => alert("ไอควายกาย")}>
                    <Icon name="google" size={20} color="#fff" />
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton}>
                    <Icon name="apple" size={20} color="#fff" />
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton}>
                    <Icon name="phone" size={20} color="#fff" />
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย โทรศัพท์</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
};

export default SignupPage;
