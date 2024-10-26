// NewContent.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SignupPageStyle from './SignupPageStyle';

const SignupPage = ({ onBack }) => {
    return (
        <ScrollView>
            
        <View style={SignupPageStyle.newContentContainer}>
            <Text style={SignupPageStyle.newContentText}>ยินดีต้อนรับสู่ SLIDE ME!</Text>
            <View style={SignupPageStyle.buttonContainer}>
                <TouchableOpacity style={SignupPageStyle.backButton}>
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton} onPress={() => (alert("ไอควายกาย"))}>
                    <Text style={SignupPageStyle.backButtonText} >เข้าสู่ระบบด้วย Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton}>
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton} >
                    <Text style={SignupPageStyle.backButtonText}>เข้าสู่ระบบด้วย Phone Number</Text>
                </TouchableOpacity>
                <TouchableOpacity style={SignupPageStyle.backButton} onPress={onBack}>
                    <Text style={SignupPageStyle.backButtonText}>ย้อนกลับ</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
};

export default SignupPage;
